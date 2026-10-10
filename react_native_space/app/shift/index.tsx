import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useShiftsControllerFindAll, useShiftsControllerCopyWeek } from '@/src/api/generated/api';
import { useQueryClient } from '@tanstack/react-query';
import type { ShiftResponseDto } from '@/src/api/generated/schemas';
import { LoadingScreen } from '@/src/components/LoadingScreen';
import { getErrorMessage } from '@/src/api/customFetch';
import { formatDate, getWeekdayName, istanbulToday, addDaysToDay } from '@/src/utils/format';
import { weekStart, formatHours, confirmAction } from '@/src/utils/team';
import { COLORS, SPACING, RADIUS } from '@/src/utils/theme';

export default function ShiftWeekScreen() {
  const router = useRouter();
  const today = istanbulToday();
  const [from, setFrom] = useState(weekStart(today));
  const to = addDaysToDay(from, 6);
  const isThisWeek = from === weekStart(today);
  const { data, isLoading, isError, error, refetch, isRefetching } = useShiftsControllerFindAll({ from, to });
  const queryClient = useQueryClient();
  // "Geçen haftayı kopyala": görüntülenen haftanın bir önceki haftası kaynak alınır
  const prevFrom = addDaysToDay(from, -7);
  const prevWeek = useShiftsControllerFindAll({ from: prevFrom, to: addDaysToDay(from, -1) });
  const prevCount = prevWeek.data?.items?.length ?? 0;
  const copyMut = useShiftsControllerCopyWeek();
  const [copyResult, setCopyResult] = useState<{ ok: boolean; text: string } | null>(null);

  const handleCopy = () =>
    confirmAction(
      'Geçen haftayı kopyala',
      `Geçen haftanın ${prevCount} vardiyası bu haftaya (${formatDate(from)} – ${formatDate(to)}) kopyalanacak. Aynı kişinin aynı saatte vardiyası varsa o vardiya atlanır.`,
      'Kopyala',
      async () => {
        try {
          const r = await copyMut.mutateAsync({ data: { fromWeekStart: prevFrom, toWeekStart: from } });
          await queryClient.invalidateQueries();
          const parts = [`${r.created} vardiya kopyalandı`];
          if (r.skipped > 0) parts.push(`${r.skipped} atlandı (${r.skippedReasons.slice(0, 3).map((x) => x.split(': ')[1]).filter((v, i, a) => a.indexOf(v) === i).join(', ')})`);
          setCopyResult({ ok: r.created > 0, text: parts.join(' · ') });
        } catch (e) {
          setCopyResult({ ok: false, text: getErrorMessage(e, 'Kopyalanamadı') });
        }
      },
    );

  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDaysToDay(from, i)), [from]);
  const byDay = useMemo(() => {
    const map: Record<string, ShiftResponseDto[]> = {};
    (data?.items ?? []).forEach((s) => {
      const key = s?.businessDate ?? '';
      map[key] = [...(map[key] ?? []), s];
    });
    return map;
  }, [data]);
  const totals = data?.totals ?? [];

  const openShift = (s: ShiftResponseDto) =>
    router.push({
      pathname: '/shift/form',
      params: { id: s.id, staffId: s?.staff?.id ?? '', date: s.businessDate, start: s.startTime, end: s.endTime, notes: s?.notes ?? '' },
    });

  return (
    <View style={s.container}>
      <View style={s.weekBar}>
        <Pressable style={s.arrow} onPress={() => { setFrom(addDaysToDay(from, -7)); setCopyResult(null); }} accessibilityLabel="Önceki hafta">
          <Ionicons name="chevron-back" size={24} color={COLORS.text} />
        </Pressable>
        <Pressable style={{ flex: 1, alignItems: 'center' }} onPress={() => setFrom(weekStart(today))} accessibilityLabel="Bu haftaya dön">
          <Text style={s.weekTitle}>{isThisWeek ? 'Bu Hafta' : 'Hafta'}</Text>
          <Text style={s.weekSub}>{formatDate(from)} – {formatDate(to)}</Text>
        </Pressable>
        <Pressable style={s.arrow} onPress={() => { setFrom(addDaysToDay(from, 7)); setCopyResult(null); }} accessibilityLabel="Sonraki hafta">
          <Ionicons name="chevron-forward" size={24} color={COLORS.text} />
        </Pressable>
      </View>

      <Pressable
        style={[s.copyBtn, prevCount === 0 && { opacity: 0.45 }]}
        onPress={handleCopy}
        disabled={prevCount === 0 || copyMut.isPending}
        accessibilityLabel="Geçen haftayı kopyala"
      >
        <Ionicons name="copy-outline" size={20} color={COLORS.accent} />
        <Text style={s.copyText}>
          {copyMut.isPending ? 'Kopyalanıyor…' : prevCount === 0 ? 'Geçen hafta vardiya yok' : `Geçen haftayı kopyala (${prevCount})`}
        </Text>
      </Pressable>
      {copyResult && (
        <Pressable onPress={() => setCopyResult(null)}>
          <Text style={[s.copyResult, { color: copyResult.ok ? COLORS.success : COLORS.warning }]}>{copyResult.text}</Text>
        </Pressable>
      )}

      {isLoading ? (
        <LoadingScreen />
      ) : isError ? (
        <Pressable onPress={() => refetch()}><Text style={s.error}>{getErrorMessage(error, 'Vardiyalar yüklenemedi')} — tekrar dene</Text></Pressable>
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={COLORS.accent} />}
        >
          {totals.length > 0 && (
            <View style={s.card}>
              <Text style={s.cardTitle}>Haftalık Toplam</Text>
              {totals.map((t) => (
                <View key={t.staffId} style={s.totalRow}>
                  <Text style={s.totalName}>{t?.name ?? ''}</Text>
                  <Text style={s.totalVal}>{t?.shiftCount ?? 0} gün · {formatHours(t?.minutes)}</Text>
                </View>
              ))}
            </View>
          )}

          {days.map((day) => {
            const list = byDay[day] ?? [];
            return (
              <View key={day} style={[s.day, day === today && s.dayToday]}>
                <Pressable style={s.dayHead} onPress={() => router.push({ pathname: '/shift/form', params: { date: day } })} accessibilityLabel={`${getWeekdayName(day)} vardiya ekle`}>
                  <Text style={s.dayName}>{getWeekdayName(day)} <Text style={s.dayDate}>{formatDate(day)}</Text></Text>
                  <Ionicons name="add-circle-outline" size={22} color={COLORS.accent} />
                </Pressable>
                {list.length === 0 ? (
                  <Text style={s.none}>Vardiya yok</Text>
                ) : (
                  list.map((sh) => (
                    <Pressable key={sh.id} style={s.shift} onPress={() => openShift(sh)} accessibilityLabel={`${sh?.staff?.name ?? ''} vardiyası`}>
                      <Text style={s.shiftName}>{sh?.staff?.name ?? ''}</Text>
                      <Text style={s.shiftTime}>{sh.startTime}–{sh.endTime} · {formatHours(sh.minutes)}</Text>
                    </Pressable>
                  ))
                )}
              </View>
            );
          })}
        </ScrollView>
      )}

      <Pressable style={s.fab} onPress={() => router.push({ pathname: '/shift/form', params: { date: today } })} accessibilityLabel="Yeni vardiya">
        <Ionicons name="add" size={28} color={COLORS.white} />
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.md, paddingBottom: 0 },
  weekBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.surfaceBorder, marginBottom: SPACING.md },
  arrow: { width: 52, height: 56, alignItems: 'center', justifyContent: 'center' },
  weekTitle: { color: COLORS.text, fontSize: 17, fontWeight: '700' },
  weekSub: { color: COLORS.textSecondary, fontSize: 13, marginTop: 2 },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    minHeight: 48,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.accent,
    marginBottom: SPACING.sm,
  },
  copyText: { color: COLORS.accent, fontSize: 16, fontWeight: '700' },
  copyResult: { fontSize: 15, fontWeight: '600', marginBottom: SPACING.sm, textAlign: 'center' },
  card: { backgroundColor: COLORS.surface, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.accent, padding: SPACING.md, marginBottom: SPACING.md },
  cardTitle: { color: COLORS.accent, fontSize: 14, fontWeight: '700', marginBottom: SPACING.sm },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  totalName: { color: COLORS.text, fontSize: 15 },
  totalVal: { color: COLORS.textSecondary, fontSize: 15 },
  day: { borderBottomWidth: 0.5, borderBottomColor: COLORS.surfaceBorder, paddingVertical: SPACING.sm },
  dayToday: { borderLeftWidth: 3, borderLeftColor: COLORS.accent, paddingLeft: SPACING.sm },
  dayHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', minHeight: 40 },
  dayName: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  dayDate: { color: COLORS.textMuted, fontSize: 13, fontWeight: '400' },
  none: { color: COLORS.textMuted, fontSize: 14, paddingBottom: 4 },
  shift: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.surface, borderRadius: RADIUS.sm, paddingHorizontal: SPACING.md, minHeight: 44, marginTop: 4 },
  shiftName: { color: COLORS.text, fontSize: 15, fontWeight: '600' },
  shiftTime: { color: COLORS.textSecondary, fontSize: 14 },
  error: { color: COLORS.error, fontSize: 15, padding: SPACING.md },
  fab: { position: 'absolute', right: 20, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', elevation: 4, borderWidth: 1, borderColor: COLORS.accent },
});
