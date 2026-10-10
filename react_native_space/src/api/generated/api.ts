// @ts-nocheck
import {
  useMutation,
  useQuery
} from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type {
  AuditControllerFindAllParams,
  AuditLogListDto,
  AuthResponseDto,
  BusinessSettingsResponseDto,
  ChangePasswordDto,
  ChangePasswordResponseDto,
  ClosingComparisonResponseDto,
  ClosingListResponseDto,
  ClosingResponseDto,
  ClosingSummaryResponseDto,
  ClosingsControllerFindAllParams,
  ClosingsControllerSummaryParams,
  ConversionListResponseDto,
  ConversionResponseDto,
  CopyWeekDto,
  CopyWeekResponseDto,
  CreateClosingDto,
  CreateConversionDto,
  CreateExpenseDto,
  CreateMovementDto,
  CreateProductDto,
  CreateShiftDto,
  CreateShiftTemplateDto,
  CreateStaffDto,
  DeleteExpenseResponseDto,
  DeleteResponseDto,
  DeleteShiftResponseDto,
  DeleteShiftTemplateResponseDto,
  DispatchReportDto,
  ExpenseListResponseDto,
  ExpenseResponseDto,
  ExpenseSummaryResponseDto,
  ExpensesControllerFindAllParams,
  ExpensesControllerSummaryParams,
  InitialStockResponseDto,
  InviteCreatedResponseDto,
  InviteDeleteResponseDto,
  InviteListResponseDto,
  LoginDto,
  MeResponseDto,
  MovementDocumentResponseDto,
  MovementListResponseDto,
  MovementsControllerFindAllParams,
  ProductDetailResponseDto,
  ProductListResponseDto,
  ProductResponseDto,
  ProductsControllerFindAllParams,
  ReportsControllerDispatchesParams,
  ReportsControllerExportCsvParams,
  ReportsControllerRevenueParams,
  ReportsControllerTopDispatchedParams,
  RevenueReportDto,
  ReverseMovementDto,
  ReverseMovementResponseDto,
  SetInitialStockDto,
  ShiftListResponseDto,
  ShiftResponseDto,
  ShiftTemplateListResponseDto,
  ShiftTemplateResponseDto,
  ShiftsControllerFindAllParams,
  SignupDto,
  StaffControllerFindAllParams,
  StaffListResponseDto,
  StaffResponseDto,
  TodayClosingResponseDto,
  TopDispatchedReportDto,
  UpdateBusinessSettingsDto,
  UpdateClosingDto,
  UpdateConversionDto,
  UpdateProductDto,
  UpdateShiftDto,
  UpdateShiftTemplateDto,
  UpdateStaffDto,
  UpdateUserRoleDto,
  UserListResponseDto,
  UserRoleResponseDto,
  WarehouseControllerGetStockParams,
  WarehouseStockListDto
} from './schemas';

import { customFetch } from '../customFetch';
import type { ErrorType , BodyType } from '../customFetch';


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];



export const getAuditControllerFindAllUrl = (params?: AuditControllerFindAllParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/audit-log?${stringifiedParams}` : `/api/audit-log`
}

export const auditControllerFindAll = async (params?: AuditControllerFindAllParams, options?: RequestInit): Promise<AuditLogListDto> => {

  return customFetch<AuditLogListDto>(getAuditControllerFindAllUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAuditControllerFindAllQueryKey = (params?: AuditControllerFindAllParams,) => {
    return [
    `/api/audit-log`, ...(params ? [params] : [])
    ] as const;
    }


export const getAuditControllerFindAllQueryOptions = <TData = Awaited<ReturnType<typeof auditControllerFindAll>>, TError = ErrorType<unknown>>(params?: AuditControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof auditControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAuditControllerFindAllQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof auditControllerFindAll>>> = ({ signal }) => auditControllerFindAll(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof auditControllerFindAll>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AuditControllerFindAllQueryResult = NonNullable<Awaited<ReturnType<typeof auditControllerFindAll>>>
export type AuditControllerFindAllQueryError = ErrorType<unknown>


export function useAuditControllerFindAll<TData = Awaited<ReturnType<typeof auditControllerFindAll>>, TError = ErrorType<unknown>>(
 params: undefined |  AuditControllerFindAllParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof auditControllerFindAll>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof auditControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof auditControllerFindAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAuditControllerFindAll<TData = Awaited<ReturnType<typeof auditControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: AuditControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof auditControllerFindAll>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof auditControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof auditControllerFindAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAuditControllerFindAll<TData = Awaited<ReturnType<typeof auditControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: AuditControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof auditControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAuditControllerFindAll<TData = Awaited<ReturnType<typeof auditControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: AuditControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof auditControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAuditControllerFindAllQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAuthControllerSignupUrl = () => {




  return `/api/signup`
}

export const authControllerSignup = async (signupDto: SignupDto, options?: RequestInit): Promise<AuthResponseDto> => {

  return customFetch<AuthResponseDto>(getAuthControllerSignupUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(signupDto)
  }
);}




export const getAuthControllerSignupMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerSignup>>, TError,{data: BodyType<SignupDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof authControllerSignup>>, TError,{data: BodyType<SignupDto>}, TContext> => {

const mutationKey = ['authControllerSignup'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof authControllerSignup>>, {data: BodyType<SignupDto>}> = (props) => {
          const {data} = props ?? {};

          return  authControllerSignup(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AuthControllerSignupMutationResult = NonNullable<Awaited<ReturnType<typeof authControllerSignup>>>
    export type AuthControllerSignupMutationBody = BodyType<SignupDto>
    export type AuthControllerSignupMutationError = ErrorType<unknown>

    export const useAuthControllerSignup = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerSignup>>, TError,{data: BodyType<SignupDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof authControllerSignup>>,
        TError,
        {data: BodyType<SignupDto>},
        TContext
      > => {
      return useMutation(getAuthControllerSignupMutationOptions(options), queryClient);
    }

export const getAuthControllerLoginUrl = () => {




  return `/api/auth/login`
}

export const authControllerLogin = async (loginDto: LoginDto, options?: RequestInit): Promise<AuthResponseDto> => {

  return customFetch<AuthResponseDto>(getAuthControllerLoginUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(loginDto)
  }
);}




export const getAuthControllerLoginMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerLogin>>, TError,{data: BodyType<LoginDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof authControllerLogin>>, TError,{data: BodyType<LoginDto>}, TContext> => {

const mutationKey = ['authControllerLogin'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof authControllerLogin>>, {data: BodyType<LoginDto>}> = (props) => {
          const {data} = props ?? {};

          return  authControllerLogin(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AuthControllerLoginMutationResult = NonNullable<Awaited<ReturnType<typeof authControllerLogin>>>
    export type AuthControllerLoginMutationBody = BodyType<LoginDto>
    export type AuthControllerLoginMutationError = ErrorType<unknown>

    export const useAuthControllerLogin = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerLogin>>, TError,{data: BodyType<LoginDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof authControllerLogin>>,
        TError,
        {data: BodyType<LoginDto>},
        TContext
      > => {
      return useMutation(getAuthControllerLoginMutationOptions(options), queryClient);
    }

export const getAuthControllerMeUrl = () => {




  return `/api/auth/me`
}

export const authControllerMe = async ( options?: RequestInit): Promise<MeResponseDto> => {

  return customFetch<MeResponseDto>(getAuthControllerMeUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAuthControllerMeQueryKey = () => {
    return [
    `/api/auth/me`
    ] as const;
    }


export const getAuthControllerMeQueryOptions = <TData = Awaited<ReturnType<typeof authControllerMe>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerMe>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAuthControllerMeQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof authControllerMe>>> = ({ signal }) => authControllerMe({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof authControllerMe>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AuthControllerMeQueryResult = NonNullable<Awaited<ReturnType<typeof authControllerMe>>>
export type AuthControllerMeQueryError = ErrorType<unknown>


export function useAuthControllerMe<TData = Awaited<ReturnType<typeof authControllerMe>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerMe>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof authControllerMe>>,
          TError,
          Awaited<ReturnType<typeof authControllerMe>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAuthControllerMe<TData = Awaited<ReturnType<typeof authControllerMe>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerMe>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof authControllerMe>>,
          TError,
          Awaited<ReturnType<typeof authControllerMe>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAuthControllerMe<TData = Awaited<ReturnType<typeof authControllerMe>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerMe>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAuthControllerMe<TData = Awaited<ReturnType<typeof authControllerMe>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerMe>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAuthControllerMeQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAuthControllerChangePasswordUrl = () => {




  return `/api/auth/change-password`
}

export const authControllerChangePassword = async (changePasswordDto: ChangePasswordDto, options?: RequestInit): Promise<ChangePasswordResponseDto> => {

  return customFetch<ChangePasswordResponseDto>(getAuthControllerChangePasswordUrl(),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(changePasswordDto)
  }
);}




export const getAuthControllerChangePasswordMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerChangePassword>>, TError,{data: BodyType<ChangePasswordDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof authControllerChangePassword>>, TError,{data: BodyType<ChangePasswordDto>}, TContext> => {

const mutationKey = ['authControllerChangePassword'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof authControllerChangePassword>>, {data: BodyType<ChangePasswordDto>}> = (props) => {
          const {data} = props ?? {};

          return  authControllerChangePassword(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AuthControllerChangePasswordMutationResult = NonNullable<Awaited<ReturnType<typeof authControllerChangePassword>>>
    export type AuthControllerChangePasswordMutationBody = BodyType<ChangePasswordDto>
    export type AuthControllerChangePasswordMutationError = ErrorType<unknown>

    export const useAuthControllerChangePassword = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerChangePassword>>, TError,{data: BodyType<ChangePasswordDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof authControllerChangePassword>>,
        TError,
        {data: BodyType<ChangePasswordDto>},
        TContext
      > => {
      return useMutation(getAuthControllerChangePasswordMutationOptions(options), queryClient);
    }

export const getProductsControllerFindAllUrl = (params?: ProductsControllerFindAllParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/products?${stringifiedParams}` : `/api/products`
}

export const productsControllerFindAll = async (params?: ProductsControllerFindAllParams, options?: RequestInit): Promise<ProductListResponseDto> => {

  return customFetch<ProductListResponseDto>(getProductsControllerFindAllUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getProductsControllerFindAllQueryKey = (params?: ProductsControllerFindAllParams,) => {
    return [
    `/api/products`, ...(params ? [params] : [])
    ] as const;
    }


export const getProductsControllerFindAllQueryOptions = <TData = Awaited<ReturnType<typeof productsControllerFindAll>>, TError = ErrorType<unknown>>(params?: ProductsControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof productsControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getProductsControllerFindAllQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof productsControllerFindAll>>> = ({ signal }) => productsControllerFindAll(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof productsControllerFindAll>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ProductsControllerFindAllQueryResult = NonNullable<Awaited<ReturnType<typeof productsControllerFindAll>>>
export type ProductsControllerFindAllQueryError = ErrorType<unknown>


export function useProductsControllerFindAll<TData = Awaited<ReturnType<typeof productsControllerFindAll>>, TError = ErrorType<unknown>>(
 params: undefined |  ProductsControllerFindAllParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof productsControllerFindAll>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof productsControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof productsControllerFindAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useProductsControllerFindAll<TData = Awaited<ReturnType<typeof productsControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: ProductsControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof productsControllerFindAll>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof productsControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof productsControllerFindAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useProductsControllerFindAll<TData = Awaited<ReturnType<typeof productsControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: ProductsControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof productsControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useProductsControllerFindAll<TData = Awaited<ReturnType<typeof productsControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: ProductsControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof productsControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getProductsControllerFindAllQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getProductsControllerCreateUrl = () => {




  return `/api/products`
}

export const productsControllerCreate = async (createProductDto: CreateProductDto, options?: RequestInit): Promise<ProductResponseDto> => {

  return customFetch<ProductResponseDto>(getProductsControllerCreateUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(createProductDto)
  }
);}




export const getProductsControllerCreateMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof productsControllerCreate>>, TError,{data: BodyType<CreateProductDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof productsControllerCreate>>, TError,{data: BodyType<CreateProductDto>}, TContext> => {

const mutationKey = ['productsControllerCreate'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof productsControllerCreate>>, {data: BodyType<CreateProductDto>}> = (props) => {
          const {data} = props ?? {};

          return  productsControllerCreate(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ProductsControllerCreateMutationResult = NonNullable<Awaited<ReturnType<typeof productsControllerCreate>>>
    export type ProductsControllerCreateMutationBody = BodyType<CreateProductDto>
    export type ProductsControllerCreateMutationError = ErrorType<unknown>

    export const useProductsControllerCreate = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof productsControllerCreate>>, TError,{data: BodyType<CreateProductDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof productsControllerCreate>>,
        TError,
        {data: BodyType<CreateProductDto>},
        TContext
      > => {
      return useMutation(getProductsControllerCreateMutationOptions(options), queryClient);
    }

export const getProductsControllerFindOneUrl = (id: string,) => {




  return `/api/products/${id}`
}

export const productsControllerFindOne = async (id: string, options?: RequestInit): Promise<ProductDetailResponseDto> => {

  return customFetch<ProductDetailResponseDto>(getProductsControllerFindOneUrl(id),
  {
    ...options,
    method: 'GET'


  }
);}





export const getProductsControllerFindOneQueryKey = (id: string,) => {
    return [
    `/api/products/${id}`
    ] as const;
    }


export const getProductsControllerFindOneQueryOptions = <TData = Awaited<ReturnType<typeof productsControllerFindOne>>, TError = ErrorType<unknown>>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof productsControllerFindOne>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getProductsControllerFindOneQueryKey(id);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof productsControllerFindOne>>> = ({ signal }) => productsControllerFindOne(id, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: id !== null && id !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof productsControllerFindOne>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ProductsControllerFindOneQueryResult = NonNullable<Awaited<ReturnType<typeof productsControllerFindOne>>>
export type ProductsControllerFindOneQueryError = ErrorType<unknown>


export function useProductsControllerFindOne<TData = Awaited<ReturnType<typeof productsControllerFindOne>>, TError = ErrorType<unknown>>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof productsControllerFindOne>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof productsControllerFindOne>>,
          TError,
          Awaited<ReturnType<typeof productsControllerFindOne>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useProductsControllerFindOne<TData = Awaited<ReturnType<typeof productsControllerFindOne>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof productsControllerFindOne>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof productsControllerFindOne>>,
          TError,
          Awaited<ReturnType<typeof productsControllerFindOne>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useProductsControllerFindOne<TData = Awaited<ReturnType<typeof productsControllerFindOne>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof productsControllerFindOne>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useProductsControllerFindOne<TData = Awaited<ReturnType<typeof productsControllerFindOne>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof productsControllerFindOne>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getProductsControllerFindOneQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getProductsControllerUpdateUrl = (id: string,) => {




  return `/api/products/${id}`
}

export const productsControllerUpdate = async (id: string,
    updateProductDto: UpdateProductDto, options?: RequestInit): Promise<ProductResponseDto> => {

  return customFetch<ProductResponseDto>(getProductsControllerUpdateUrl(id),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(updateProductDto)
  }
);}




export const getProductsControllerUpdateMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof productsControllerUpdate>>, TError,{id: string;data: BodyType<UpdateProductDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof productsControllerUpdate>>, TError,{id: string;data: BodyType<UpdateProductDto>}, TContext> => {

const mutationKey = ['productsControllerUpdate'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof productsControllerUpdate>>, {id: string;data: BodyType<UpdateProductDto>}> = (props) => {
          const {id,data} = props ?? {};

          return  productsControllerUpdate(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ProductsControllerUpdateMutationResult = NonNullable<Awaited<ReturnType<typeof productsControllerUpdate>>>
    export type ProductsControllerUpdateMutationBody = BodyType<UpdateProductDto>
    export type ProductsControllerUpdateMutationError = ErrorType<unknown>

    export const useProductsControllerUpdate = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof productsControllerUpdate>>, TError,{id: string;data: BodyType<UpdateProductDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof productsControllerUpdate>>,
        TError,
        {id: string;data: BodyType<UpdateProductDto>},
        TContext
      > => {
      return useMutation(getProductsControllerUpdateMutationOptions(options), queryClient);
    }

export const getProductsControllerGetConversionsUrl = (id: string,) => {




  return `/api/products/${id}/conversions`
}

export const productsControllerGetConversions = async (id: string, options?: RequestInit): Promise<ConversionListResponseDto> => {

  return customFetch<ConversionListResponseDto>(getProductsControllerGetConversionsUrl(id),
  {
    ...options,
    method: 'GET'


  }
);}





export const getProductsControllerGetConversionsQueryKey = (id: string,) => {
    return [
    `/api/products/${id}/conversions`
    ] as const;
    }


export const getProductsControllerGetConversionsQueryOptions = <TData = Awaited<ReturnType<typeof productsControllerGetConversions>>, TError = ErrorType<unknown>>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof productsControllerGetConversions>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getProductsControllerGetConversionsQueryKey(id);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof productsControllerGetConversions>>> = ({ signal }) => productsControllerGetConversions(id, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: id !== null && id !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof productsControllerGetConversions>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ProductsControllerGetConversionsQueryResult = NonNullable<Awaited<ReturnType<typeof productsControllerGetConversions>>>
export type ProductsControllerGetConversionsQueryError = ErrorType<unknown>


export function useProductsControllerGetConversions<TData = Awaited<ReturnType<typeof productsControllerGetConversions>>, TError = ErrorType<unknown>>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof productsControllerGetConversions>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof productsControllerGetConversions>>,
          TError,
          Awaited<ReturnType<typeof productsControllerGetConversions>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useProductsControllerGetConversions<TData = Awaited<ReturnType<typeof productsControllerGetConversions>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof productsControllerGetConversions>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof productsControllerGetConversions>>,
          TError,
          Awaited<ReturnType<typeof productsControllerGetConversions>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useProductsControllerGetConversions<TData = Awaited<ReturnType<typeof productsControllerGetConversions>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof productsControllerGetConversions>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useProductsControllerGetConversions<TData = Awaited<ReturnType<typeof productsControllerGetConversions>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof productsControllerGetConversions>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getProductsControllerGetConversionsQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getProductsControllerCreateConversionUrl = (id: string,) => {




  return `/api/products/${id}/conversions`
}

export const productsControllerCreateConversion = async (id: string,
    createConversionDto: CreateConversionDto, options?: RequestInit): Promise<ConversionResponseDto> => {

  return customFetch<ConversionResponseDto>(getProductsControllerCreateConversionUrl(id),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(createConversionDto)
  }
);}




export const getProductsControllerCreateConversionMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof productsControllerCreateConversion>>, TError,{id: string;data: BodyType<CreateConversionDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof productsControllerCreateConversion>>, TError,{id: string;data: BodyType<CreateConversionDto>}, TContext> => {

const mutationKey = ['productsControllerCreateConversion'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof productsControllerCreateConversion>>, {id: string;data: BodyType<CreateConversionDto>}> = (props) => {
          const {id,data} = props ?? {};

          return  productsControllerCreateConversion(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ProductsControllerCreateConversionMutationResult = NonNullable<Awaited<ReturnType<typeof productsControllerCreateConversion>>>
    export type ProductsControllerCreateConversionMutationBody = BodyType<CreateConversionDto>
    export type ProductsControllerCreateConversionMutationError = ErrorType<unknown>

    export const useProductsControllerCreateConversion = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof productsControllerCreateConversion>>, TError,{id: string;data: BodyType<CreateConversionDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof productsControllerCreateConversion>>,
        TError,
        {id: string;data: BodyType<CreateConversionDto>},
        TContext
      > => {
      return useMutation(getProductsControllerCreateConversionMutationOptions(options), queryClient);
    }

export const getProductsControllerUpdateConversionUrl = (id: string,
    conversionId: string,) => {




  return `/api/products/${id}/conversions/${conversionId}`
}

export const productsControllerUpdateConversion = async (id: string,
    conversionId: string,
    updateConversionDto: UpdateConversionDto, options?: RequestInit): Promise<ConversionResponseDto> => {

  return customFetch<ConversionResponseDto>(getProductsControllerUpdateConversionUrl(id,conversionId),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(updateConversionDto)
  }
);}




export const getProductsControllerUpdateConversionMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof productsControllerUpdateConversion>>, TError,{id: string;conversionId: string;data: BodyType<UpdateConversionDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof productsControllerUpdateConversion>>, TError,{id: string;conversionId: string;data: BodyType<UpdateConversionDto>}, TContext> => {

const mutationKey = ['productsControllerUpdateConversion'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof productsControllerUpdateConversion>>, {id: string;conversionId: string;data: BodyType<UpdateConversionDto>}> = (props) => {
          const {id,conversionId,data} = props ?? {};

          return  productsControllerUpdateConversion(id,conversionId,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ProductsControllerUpdateConversionMutationResult = NonNullable<Awaited<ReturnType<typeof productsControllerUpdateConversion>>>
    export type ProductsControllerUpdateConversionMutationBody = BodyType<UpdateConversionDto>
    export type ProductsControllerUpdateConversionMutationError = ErrorType<unknown>

    export const useProductsControllerUpdateConversion = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof productsControllerUpdateConversion>>, TError,{id: string;conversionId: string;data: BodyType<UpdateConversionDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof productsControllerUpdateConversion>>,
        TError,
        {id: string;conversionId: string;data: BodyType<UpdateConversionDto>},
        TContext
      > => {
      return useMutation(getProductsControllerUpdateConversionMutationOptions(options), queryClient);
    }

export const getProductsControllerSetInitialStockUrl = (id: string,) => {




  return `/api/products/${id}/initial-stock`
}

export const productsControllerSetInitialStock = async (id: string,
    setInitialStockDto: SetInitialStockDto, options?: RequestInit): Promise<InitialStockResponseDto> => {

  return customFetch<InitialStockResponseDto>(getProductsControllerSetInitialStockUrl(id),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(setInitialStockDto)
  }
);}




export const getProductsControllerSetInitialStockMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof productsControllerSetInitialStock>>, TError,{id: string;data: BodyType<SetInitialStockDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof productsControllerSetInitialStock>>, TError,{id: string;data: BodyType<SetInitialStockDto>}, TContext> => {

const mutationKey = ['productsControllerSetInitialStock'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof productsControllerSetInitialStock>>, {id: string;data: BodyType<SetInitialStockDto>}> = (props) => {
          const {id,data} = props ?? {};

          return  productsControllerSetInitialStock(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ProductsControllerSetInitialStockMutationResult = NonNullable<Awaited<ReturnType<typeof productsControllerSetInitialStock>>>
    export type ProductsControllerSetInitialStockMutationBody = BodyType<SetInitialStockDto>
    export type ProductsControllerSetInitialStockMutationError = ErrorType<unknown>

    export const useProductsControllerSetInitialStock = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof productsControllerSetInitialStock>>, TError,{id: string;data: BodyType<SetInitialStockDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof productsControllerSetInitialStock>>,
        TError,
        {id: string;data: BodyType<SetInitialStockDto>},
        TContext
      > => {
      return useMutation(getProductsControllerSetInitialStockMutationOptions(options), queryClient);
    }

export const getMovementsControllerFindAllUrl = (params?: MovementsControllerFindAllParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/movements?${stringifiedParams}` : `/api/movements`
}

export const movementsControllerFindAll = async (params?: MovementsControllerFindAllParams, options?: RequestInit): Promise<MovementListResponseDto> => {

  return customFetch<MovementListResponseDto>(getMovementsControllerFindAllUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getMovementsControllerFindAllQueryKey = (params?: MovementsControllerFindAllParams,) => {
    return [
    `/api/movements`, ...(params ? [params] : [])
    ] as const;
    }


export const getMovementsControllerFindAllQueryOptions = <TData = Awaited<ReturnType<typeof movementsControllerFindAll>>, TError = ErrorType<unknown>>(params?: MovementsControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof movementsControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getMovementsControllerFindAllQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof movementsControllerFindAll>>> = ({ signal }) => movementsControllerFindAll(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof movementsControllerFindAll>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type MovementsControllerFindAllQueryResult = NonNullable<Awaited<ReturnType<typeof movementsControllerFindAll>>>
export type MovementsControllerFindAllQueryError = ErrorType<unknown>


export function useMovementsControllerFindAll<TData = Awaited<ReturnType<typeof movementsControllerFindAll>>, TError = ErrorType<unknown>>(
 params: undefined |  MovementsControllerFindAllParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof movementsControllerFindAll>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof movementsControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof movementsControllerFindAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useMovementsControllerFindAll<TData = Awaited<ReturnType<typeof movementsControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: MovementsControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof movementsControllerFindAll>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof movementsControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof movementsControllerFindAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useMovementsControllerFindAll<TData = Awaited<ReturnType<typeof movementsControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: MovementsControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof movementsControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useMovementsControllerFindAll<TData = Awaited<ReturnType<typeof movementsControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: MovementsControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof movementsControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getMovementsControllerFindAllQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getMovementsControllerCreateUrl = () => {




  return `/api/movements`
}

export const movementsControllerCreate = async (createMovementDto: CreateMovementDto, options?: RequestInit): Promise<MovementDocumentResponseDto> => {

  return customFetch<MovementDocumentResponseDto>(getMovementsControllerCreateUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(createMovementDto)
  }
);}




export const getMovementsControllerCreateMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof movementsControllerCreate>>, TError,{data: BodyType<CreateMovementDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof movementsControllerCreate>>, TError,{data: BodyType<CreateMovementDto>}, TContext> => {

const mutationKey = ['movementsControllerCreate'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof movementsControllerCreate>>, {data: BodyType<CreateMovementDto>}> = (props) => {
          const {data} = props ?? {};

          return  movementsControllerCreate(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type MovementsControllerCreateMutationResult = NonNullable<Awaited<ReturnType<typeof movementsControllerCreate>>>
    export type MovementsControllerCreateMutationBody = BodyType<CreateMovementDto>
    export type MovementsControllerCreateMutationError = ErrorType<unknown>

    export const useMovementsControllerCreate = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof movementsControllerCreate>>, TError,{data: BodyType<CreateMovementDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof movementsControllerCreate>>,
        TError,
        {data: BodyType<CreateMovementDto>},
        TContext
      > => {
      return useMutation(getMovementsControllerCreateMutationOptions(options), queryClient);
    }

export const getMovementsControllerFindOneUrl = (id: string,) => {




  return `/api/movements/${id}`
}

export const movementsControllerFindOne = async (id: string, options?: RequestInit): Promise<MovementDocumentResponseDto> => {

  return customFetch<MovementDocumentResponseDto>(getMovementsControllerFindOneUrl(id),
  {
    ...options,
    method: 'GET'


  }
);}





export const getMovementsControllerFindOneQueryKey = (id: string,) => {
    return [
    `/api/movements/${id}`
    ] as const;
    }


export const getMovementsControllerFindOneQueryOptions = <TData = Awaited<ReturnType<typeof movementsControllerFindOne>>, TError = ErrorType<unknown>>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof movementsControllerFindOne>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getMovementsControllerFindOneQueryKey(id);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof movementsControllerFindOne>>> = ({ signal }) => movementsControllerFindOne(id, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: id !== null && id !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof movementsControllerFindOne>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type MovementsControllerFindOneQueryResult = NonNullable<Awaited<ReturnType<typeof movementsControllerFindOne>>>
export type MovementsControllerFindOneQueryError = ErrorType<unknown>


export function useMovementsControllerFindOne<TData = Awaited<ReturnType<typeof movementsControllerFindOne>>, TError = ErrorType<unknown>>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof movementsControllerFindOne>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof movementsControllerFindOne>>,
          TError,
          Awaited<ReturnType<typeof movementsControllerFindOne>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useMovementsControllerFindOne<TData = Awaited<ReturnType<typeof movementsControllerFindOne>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof movementsControllerFindOne>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof movementsControllerFindOne>>,
          TError,
          Awaited<ReturnType<typeof movementsControllerFindOne>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useMovementsControllerFindOne<TData = Awaited<ReturnType<typeof movementsControllerFindOne>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof movementsControllerFindOne>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useMovementsControllerFindOne<TData = Awaited<ReturnType<typeof movementsControllerFindOne>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof movementsControllerFindOne>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getMovementsControllerFindOneQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getMovementsControllerReverseUrl = (id: string,) => {




  return `/api/movements/${id}/reverse`
}

export const movementsControllerReverse = async (id: string,
    reverseMovementDto: ReverseMovementDto, options?: RequestInit): Promise<ReverseMovementResponseDto> => {

  return customFetch<ReverseMovementResponseDto>(getMovementsControllerReverseUrl(id),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(reverseMovementDto)
  }
);}




export const getMovementsControllerReverseMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof movementsControllerReverse>>, TError,{id: string;data: BodyType<ReverseMovementDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof movementsControllerReverse>>, TError,{id: string;data: BodyType<ReverseMovementDto>}, TContext> => {

const mutationKey = ['movementsControllerReverse'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof movementsControllerReverse>>, {id: string;data: BodyType<ReverseMovementDto>}> = (props) => {
          const {id,data} = props ?? {};

          return  movementsControllerReverse(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type MovementsControllerReverseMutationResult = NonNullable<Awaited<ReturnType<typeof movementsControllerReverse>>>
    export type MovementsControllerReverseMutationBody = BodyType<ReverseMovementDto>
    export type MovementsControllerReverseMutationError = ErrorType<unknown>

    export const useMovementsControllerReverse = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof movementsControllerReverse>>, TError,{id: string;data: BodyType<ReverseMovementDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof movementsControllerReverse>>,
        TError,
        {id: string;data: BodyType<ReverseMovementDto>},
        TContext
      > => {
      return useMutation(getMovementsControllerReverseMutationOptions(options), queryClient);
    }

export const getWarehouseControllerGetStockUrl = (params?: WarehouseControllerGetStockParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/warehouse-stock?${stringifiedParams}` : `/api/warehouse-stock`
}

export const warehouseControllerGetStock = async (params?: WarehouseControllerGetStockParams, options?: RequestInit): Promise<WarehouseStockListDto> => {

  return customFetch<WarehouseStockListDto>(getWarehouseControllerGetStockUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getWarehouseControllerGetStockQueryKey = (params?: WarehouseControllerGetStockParams,) => {
    return [
    `/api/warehouse-stock`, ...(params ? [params] : [])
    ] as const;
    }


export const getWarehouseControllerGetStockQueryOptions = <TData = Awaited<ReturnType<typeof warehouseControllerGetStock>>, TError = ErrorType<unknown>>(params?: WarehouseControllerGetStockParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof warehouseControllerGetStock>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getWarehouseControllerGetStockQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof warehouseControllerGetStock>>> = ({ signal }) => warehouseControllerGetStock(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof warehouseControllerGetStock>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type WarehouseControllerGetStockQueryResult = NonNullable<Awaited<ReturnType<typeof warehouseControllerGetStock>>>
export type WarehouseControllerGetStockQueryError = ErrorType<unknown>


export function useWarehouseControllerGetStock<TData = Awaited<ReturnType<typeof warehouseControllerGetStock>>, TError = ErrorType<unknown>>(
 params: undefined |  WarehouseControllerGetStockParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof warehouseControllerGetStock>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof warehouseControllerGetStock>>,
          TError,
          Awaited<ReturnType<typeof warehouseControllerGetStock>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useWarehouseControllerGetStock<TData = Awaited<ReturnType<typeof warehouseControllerGetStock>>, TError = ErrorType<unknown>>(
 params?: WarehouseControllerGetStockParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof warehouseControllerGetStock>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof warehouseControllerGetStock>>,
          TError,
          Awaited<ReturnType<typeof warehouseControllerGetStock>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useWarehouseControllerGetStock<TData = Awaited<ReturnType<typeof warehouseControllerGetStock>>, TError = ErrorType<unknown>>(
 params?: WarehouseControllerGetStockParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof warehouseControllerGetStock>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useWarehouseControllerGetStock<TData = Awaited<ReturnType<typeof warehouseControllerGetStock>>, TError = ErrorType<unknown>>(
 params?: WarehouseControllerGetStockParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof warehouseControllerGetStock>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getWarehouseControllerGetStockQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getClosingsControllerTodayUrl = () => {




  return `/api/closings/today`
}

export const closingsControllerToday = async ( options?: RequestInit): Promise<TodayClosingResponseDto> => {

  return customFetch<TodayClosingResponseDto>(getClosingsControllerTodayUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getClosingsControllerTodayQueryKey = () => {
    return [
    `/api/closings/today`
    ] as const;
    }


export const getClosingsControllerTodayQueryOptions = <TData = Awaited<ReturnType<typeof closingsControllerToday>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof closingsControllerToday>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getClosingsControllerTodayQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof closingsControllerToday>>> = ({ signal }) => closingsControllerToday({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof closingsControllerToday>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ClosingsControllerTodayQueryResult = NonNullable<Awaited<ReturnType<typeof closingsControllerToday>>>
export type ClosingsControllerTodayQueryError = ErrorType<unknown>


export function useClosingsControllerToday<TData = Awaited<ReturnType<typeof closingsControllerToday>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof closingsControllerToday>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof closingsControllerToday>>,
          TError,
          Awaited<ReturnType<typeof closingsControllerToday>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useClosingsControllerToday<TData = Awaited<ReturnType<typeof closingsControllerToday>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof closingsControllerToday>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof closingsControllerToday>>,
          TError,
          Awaited<ReturnType<typeof closingsControllerToday>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useClosingsControllerToday<TData = Awaited<ReturnType<typeof closingsControllerToday>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof closingsControllerToday>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useClosingsControllerToday<TData = Awaited<ReturnType<typeof closingsControllerToday>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof closingsControllerToday>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getClosingsControllerTodayQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getClosingsControllerSummaryUrl = (params?: ClosingsControllerSummaryParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/closings/summary?${stringifiedParams}` : `/api/closings/summary`
}

export const closingsControllerSummary = async (params?: ClosingsControllerSummaryParams, options?: RequestInit): Promise<ClosingSummaryResponseDto> => {

  return customFetch<ClosingSummaryResponseDto>(getClosingsControllerSummaryUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getClosingsControllerSummaryQueryKey = (params?: ClosingsControllerSummaryParams,) => {
    return [
    `/api/closings/summary`, ...(params ? [params] : [])
    ] as const;
    }


export const getClosingsControllerSummaryQueryOptions = <TData = Awaited<ReturnType<typeof closingsControllerSummary>>, TError = ErrorType<unknown>>(params?: ClosingsControllerSummaryParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof closingsControllerSummary>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getClosingsControllerSummaryQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof closingsControllerSummary>>> = ({ signal }) => closingsControllerSummary(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof closingsControllerSummary>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ClosingsControllerSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof closingsControllerSummary>>>
export type ClosingsControllerSummaryQueryError = ErrorType<unknown>


export function useClosingsControllerSummary<TData = Awaited<ReturnType<typeof closingsControllerSummary>>, TError = ErrorType<unknown>>(
 params: undefined |  ClosingsControllerSummaryParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof closingsControllerSummary>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof closingsControllerSummary>>,
          TError,
          Awaited<ReturnType<typeof closingsControllerSummary>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useClosingsControllerSummary<TData = Awaited<ReturnType<typeof closingsControllerSummary>>, TError = ErrorType<unknown>>(
 params?: ClosingsControllerSummaryParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof closingsControllerSummary>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof closingsControllerSummary>>,
          TError,
          Awaited<ReturnType<typeof closingsControllerSummary>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useClosingsControllerSummary<TData = Awaited<ReturnType<typeof closingsControllerSummary>>, TError = ErrorType<unknown>>(
 params?: ClosingsControllerSummaryParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof closingsControllerSummary>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useClosingsControllerSummary<TData = Awaited<ReturnType<typeof closingsControllerSummary>>, TError = ErrorType<unknown>>(
 params?: ClosingsControllerSummaryParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof closingsControllerSummary>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getClosingsControllerSummaryQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getClosingsControllerComparisonUrl = () => {




  return `/api/closings/comparison`
}

export const closingsControllerComparison = async ( options?: RequestInit): Promise<ClosingComparisonResponseDto> => {

  return customFetch<ClosingComparisonResponseDto>(getClosingsControllerComparisonUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getClosingsControllerComparisonQueryKey = () => {
    return [
    `/api/closings/comparison`
    ] as const;
    }


export const getClosingsControllerComparisonQueryOptions = <TData = Awaited<ReturnType<typeof closingsControllerComparison>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof closingsControllerComparison>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getClosingsControllerComparisonQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof closingsControllerComparison>>> = ({ signal }) => closingsControllerComparison({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof closingsControllerComparison>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ClosingsControllerComparisonQueryResult = NonNullable<Awaited<ReturnType<typeof closingsControllerComparison>>>
export type ClosingsControllerComparisonQueryError = ErrorType<unknown>


export function useClosingsControllerComparison<TData = Awaited<ReturnType<typeof closingsControllerComparison>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof closingsControllerComparison>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof closingsControllerComparison>>,
          TError,
          Awaited<ReturnType<typeof closingsControllerComparison>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useClosingsControllerComparison<TData = Awaited<ReturnType<typeof closingsControllerComparison>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof closingsControllerComparison>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof closingsControllerComparison>>,
          TError,
          Awaited<ReturnType<typeof closingsControllerComparison>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useClosingsControllerComparison<TData = Awaited<ReturnType<typeof closingsControllerComparison>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof closingsControllerComparison>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useClosingsControllerComparison<TData = Awaited<ReturnType<typeof closingsControllerComparison>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof closingsControllerComparison>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getClosingsControllerComparisonQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getClosingsControllerFindAllUrl = (params?: ClosingsControllerFindAllParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/closings?${stringifiedParams}` : `/api/closings`
}

export const closingsControllerFindAll = async (params?: ClosingsControllerFindAllParams, options?: RequestInit): Promise<ClosingListResponseDto> => {

  return customFetch<ClosingListResponseDto>(getClosingsControllerFindAllUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getClosingsControllerFindAllQueryKey = (params?: ClosingsControllerFindAllParams,) => {
    return [
    `/api/closings`, ...(params ? [params] : [])
    ] as const;
    }


export const getClosingsControllerFindAllQueryOptions = <TData = Awaited<ReturnType<typeof closingsControllerFindAll>>, TError = ErrorType<unknown>>(params?: ClosingsControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof closingsControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getClosingsControllerFindAllQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof closingsControllerFindAll>>> = ({ signal }) => closingsControllerFindAll(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof closingsControllerFindAll>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ClosingsControllerFindAllQueryResult = NonNullable<Awaited<ReturnType<typeof closingsControllerFindAll>>>
export type ClosingsControllerFindAllQueryError = ErrorType<unknown>


export function useClosingsControllerFindAll<TData = Awaited<ReturnType<typeof closingsControllerFindAll>>, TError = ErrorType<unknown>>(
 params: undefined |  ClosingsControllerFindAllParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof closingsControllerFindAll>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof closingsControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof closingsControllerFindAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useClosingsControllerFindAll<TData = Awaited<ReturnType<typeof closingsControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: ClosingsControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof closingsControllerFindAll>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof closingsControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof closingsControllerFindAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useClosingsControllerFindAll<TData = Awaited<ReturnType<typeof closingsControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: ClosingsControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof closingsControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useClosingsControllerFindAll<TData = Awaited<ReturnType<typeof closingsControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: ClosingsControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof closingsControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getClosingsControllerFindAllQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getClosingsControllerCreateUrl = () => {




  return `/api/closings`
}

export const closingsControllerCreate = async (createClosingDto: CreateClosingDto, options?: RequestInit): Promise<ClosingResponseDto> => {

  return customFetch<ClosingResponseDto>(getClosingsControllerCreateUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(createClosingDto)
  }
);}




export const getClosingsControllerCreateMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof closingsControllerCreate>>, TError,{data: BodyType<CreateClosingDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof closingsControllerCreate>>, TError,{data: BodyType<CreateClosingDto>}, TContext> => {

const mutationKey = ['closingsControllerCreate'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof closingsControllerCreate>>, {data: BodyType<CreateClosingDto>}> = (props) => {
          const {data} = props ?? {};

          return  closingsControllerCreate(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ClosingsControllerCreateMutationResult = NonNullable<Awaited<ReturnType<typeof closingsControllerCreate>>>
    export type ClosingsControllerCreateMutationBody = BodyType<CreateClosingDto>
    export type ClosingsControllerCreateMutationError = ErrorType<unknown>

    export const useClosingsControllerCreate = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof closingsControllerCreate>>, TError,{data: BodyType<CreateClosingDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof closingsControllerCreate>>,
        TError,
        {data: BodyType<CreateClosingDto>},
        TContext
      > => {
      return useMutation(getClosingsControllerCreateMutationOptions(options), queryClient);
    }

export const getClosingsControllerFindOneUrl = (id: string,) => {




  return `/api/closings/${id}`
}

export const closingsControllerFindOne = async (id: string, options?: RequestInit): Promise<ClosingResponseDto> => {

  return customFetch<ClosingResponseDto>(getClosingsControllerFindOneUrl(id),
  {
    ...options,
    method: 'GET'


  }
);}





export const getClosingsControllerFindOneQueryKey = (id: string,) => {
    return [
    `/api/closings/${id}`
    ] as const;
    }


export const getClosingsControllerFindOneQueryOptions = <TData = Awaited<ReturnType<typeof closingsControllerFindOne>>, TError = ErrorType<unknown>>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof closingsControllerFindOne>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getClosingsControllerFindOneQueryKey(id);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof closingsControllerFindOne>>> = ({ signal }) => closingsControllerFindOne(id, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: id !== null && id !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof closingsControllerFindOne>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ClosingsControllerFindOneQueryResult = NonNullable<Awaited<ReturnType<typeof closingsControllerFindOne>>>
export type ClosingsControllerFindOneQueryError = ErrorType<unknown>


export function useClosingsControllerFindOne<TData = Awaited<ReturnType<typeof closingsControllerFindOne>>, TError = ErrorType<unknown>>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof closingsControllerFindOne>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof closingsControllerFindOne>>,
          TError,
          Awaited<ReturnType<typeof closingsControllerFindOne>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useClosingsControllerFindOne<TData = Awaited<ReturnType<typeof closingsControllerFindOne>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof closingsControllerFindOne>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof closingsControllerFindOne>>,
          TError,
          Awaited<ReturnType<typeof closingsControllerFindOne>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useClosingsControllerFindOne<TData = Awaited<ReturnType<typeof closingsControllerFindOne>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof closingsControllerFindOne>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useClosingsControllerFindOne<TData = Awaited<ReturnType<typeof closingsControllerFindOne>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof closingsControllerFindOne>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getClosingsControllerFindOneQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getClosingsControllerUpdateUrl = (id: string,) => {




  return `/api/closings/${id}`
}

export const closingsControllerUpdate = async (id: string,
    updateClosingDto: UpdateClosingDto, options?: RequestInit): Promise<ClosingResponseDto> => {

  return customFetch<ClosingResponseDto>(getClosingsControllerUpdateUrl(id),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(updateClosingDto)
  }
);}




export const getClosingsControllerUpdateMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof closingsControllerUpdate>>, TError,{id: string;data: BodyType<UpdateClosingDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof closingsControllerUpdate>>, TError,{id: string;data: BodyType<UpdateClosingDto>}, TContext> => {

const mutationKey = ['closingsControllerUpdate'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof closingsControllerUpdate>>, {id: string;data: BodyType<UpdateClosingDto>}> = (props) => {
          const {id,data} = props ?? {};

          return  closingsControllerUpdate(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ClosingsControllerUpdateMutationResult = NonNullable<Awaited<ReturnType<typeof closingsControllerUpdate>>>
    export type ClosingsControllerUpdateMutationBody = BodyType<UpdateClosingDto>
    export type ClosingsControllerUpdateMutationError = ErrorType<unknown>

    export const useClosingsControllerUpdate = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof closingsControllerUpdate>>, TError,{id: string;data: BodyType<UpdateClosingDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof closingsControllerUpdate>>,
        TError,
        {id: string;data: BodyType<UpdateClosingDto>},
        TContext
      > => {
      return useMutation(getClosingsControllerUpdateMutationOptions(options), queryClient);
    }

export const getReportsControllerRevenueUrl = (params: ReportsControllerRevenueParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/reports/revenue?${stringifiedParams}` : `/api/reports/revenue`
}

export const reportsControllerRevenue = async (params: ReportsControllerRevenueParams, options?: RequestInit): Promise<RevenueReportDto> => {

  return customFetch<RevenueReportDto>(getReportsControllerRevenueUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getReportsControllerRevenueQueryKey = (params?: ReportsControllerRevenueParams,) => {
    return [
    `/api/reports/revenue`, ...(params ? [params] : [])
    ] as const;
    }


export const getReportsControllerRevenueQueryOptions = <TData = Awaited<ReturnType<typeof reportsControllerRevenue>>, TError = ErrorType<unknown>>(params: ReportsControllerRevenueParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof reportsControllerRevenue>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getReportsControllerRevenueQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof reportsControllerRevenue>>> = ({ signal }) => reportsControllerRevenue(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof reportsControllerRevenue>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ReportsControllerRevenueQueryResult = NonNullable<Awaited<ReturnType<typeof reportsControllerRevenue>>>
export type ReportsControllerRevenueQueryError = ErrorType<unknown>


export function useReportsControllerRevenue<TData = Awaited<ReturnType<typeof reportsControllerRevenue>>, TError = ErrorType<unknown>>(
 params: ReportsControllerRevenueParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof reportsControllerRevenue>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof reportsControllerRevenue>>,
          TError,
          Awaited<ReturnType<typeof reportsControllerRevenue>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useReportsControllerRevenue<TData = Awaited<ReturnType<typeof reportsControllerRevenue>>, TError = ErrorType<unknown>>(
 params: ReportsControllerRevenueParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof reportsControllerRevenue>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof reportsControllerRevenue>>,
          TError,
          Awaited<ReturnType<typeof reportsControllerRevenue>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useReportsControllerRevenue<TData = Awaited<ReturnType<typeof reportsControllerRevenue>>, TError = ErrorType<unknown>>(
 params: ReportsControllerRevenueParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof reportsControllerRevenue>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useReportsControllerRevenue<TData = Awaited<ReturnType<typeof reportsControllerRevenue>>, TError = ErrorType<unknown>>(
 params: ReportsControllerRevenueParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof reportsControllerRevenue>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getReportsControllerRevenueQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getReportsControllerDispatchesUrl = (params: ReportsControllerDispatchesParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/reports/dispatches?${stringifiedParams}` : `/api/reports/dispatches`
}

export const reportsControllerDispatches = async (params: ReportsControllerDispatchesParams, options?: RequestInit): Promise<DispatchReportDto> => {

  return customFetch<DispatchReportDto>(getReportsControllerDispatchesUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getReportsControllerDispatchesQueryKey = (params?: ReportsControllerDispatchesParams,) => {
    return [
    `/api/reports/dispatches`, ...(params ? [params] : [])
    ] as const;
    }


export const getReportsControllerDispatchesQueryOptions = <TData = Awaited<ReturnType<typeof reportsControllerDispatches>>, TError = ErrorType<unknown>>(params: ReportsControllerDispatchesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof reportsControllerDispatches>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getReportsControllerDispatchesQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof reportsControllerDispatches>>> = ({ signal }) => reportsControllerDispatches(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof reportsControllerDispatches>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ReportsControllerDispatchesQueryResult = NonNullable<Awaited<ReturnType<typeof reportsControllerDispatches>>>
export type ReportsControllerDispatchesQueryError = ErrorType<unknown>


export function useReportsControllerDispatches<TData = Awaited<ReturnType<typeof reportsControllerDispatches>>, TError = ErrorType<unknown>>(
 params: ReportsControllerDispatchesParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof reportsControllerDispatches>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof reportsControllerDispatches>>,
          TError,
          Awaited<ReturnType<typeof reportsControllerDispatches>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useReportsControllerDispatches<TData = Awaited<ReturnType<typeof reportsControllerDispatches>>, TError = ErrorType<unknown>>(
 params: ReportsControllerDispatchesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof reportsControllerDispatches>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof reportsControllerDispatches>>,
          TError,
          Awaited<ReturnType<typeof reportsControllerDispatches>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useReportsControllerDispatches<TData = Awaited<ReturnType<typeof reportsControllerDispatches>>, TError = ErrorType<unknown>>(
 params: ReportsControllerDispatchesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof reportsControllerDispatches>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useReportsControllerDispatches<TData = Awaited<ReturnType<typeof reportsControllerDispatches>>, TError = ErrorType<unknown>>(
 params: ReportsControllerDispatchesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof reportsControllerDispatches>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getReportsControllerDispatchesQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getReportsControllerTopDispatchedUrl = (params: ReportsControllerTopDispatchedParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/reports/top-dispatched?${stringifiedParams}` : `/api/reports/top-dispatched`
}

export const reportsControllerTopDispatched = async (params: ReportsControllerTopDispatchedParams, options?: RequestInit): Promise<TopDispatchedReportDto> => {

  return customFetch<TopDispatchedReportDto>(getReportsControllerTopDispatchedUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getReportsControllerTopDispatchedQueryKey = (params?: ReportsControllerTopDispatchedParams,) => {
    return [
    `/api/reports/top-dispatched`, ...(params ? [params] : [])
    ] as const;
    }


export const getReportsControllerTopDispatchedQueryOptions = <TData = Awaited<ReturnType<typeof reportsControllerTopDispatched>>, TError = ErrorType<unknown>>(params: ReportsControllerTopDispatchedParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof reportsControllerTopDispatched>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getReportsControllerTopDispatchedQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof reportsControllerTopDispatched>>> = ({ signal }) => reportsControllerTopDispatched(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof reportsControllerTopDispatched>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ReportsControllerTopDispatchedQueryResult = NonNullable<Awaited<ReturnType<typeof reportsControllerTopDispatched>>>
export type ReportsControllerTopDispatchedQueryError = ErrorType<unknown>


export function useReportsControllerTopDispatched<TData = Awaited<ReturnType<typeof reportsControllerTopDispatched>>, TError = ErrorType<unknown>>(
 params: ReportsControllerTopDispatchedParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof reportsControllerTopDispatched>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof reportsControllerTopDispatched>>,
          TError,
          Awaited<ReturnType<typeof reportsControllerTopDispatched>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useReportsControllerTopDispatched<TData = Awaited<ReturnType<typeof reportsControllerTopDispatched>>, TError = ErrorType<unknown>>(
 params: ReportsControllerTopDispatchedParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof reportsControllerTopDispatched>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof reportsControllerTopDispatched>>,
          TError,
          Awaited<ReturnType<typeof reportsControllerTopDispatched>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useReportsControllerTopDispatched<TData = Awaited<ReturnType<typeof reportsControllerTopDispatched>>, TError = ErrorType<unknown>>(
 params: ReportsControllerTopDispatchedParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof reportsControllerTopDispatched>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useReportsControllerTopDispatched<TData = Awaited<ReturnType<typeof reportsControllerTopDispatched>>, TError = ErrorType<unknown>>(
 params: ReportsControllerTopDispatchedParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof reportsControllerTopDispatched>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getReportsControllerTopDispatchedQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getReportsControllerExportCsvUrl = (params: ReportsControllerExportCsvParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/reports/export?${stringifiedParams}` : `/api/reports/export`
}

export const reportsControllerExportCsv = async (params: ReportsControllerExportCsvParams, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getReportsControllerExportCsvUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getReportsControllerExportCsvQueryKey = (params?: ReportsControllerExportCsvParams,) => {
    return [
    `/api/reports/export`, ...(params ? [params] : [])
    ] as const;
    }


export const getReportsControllerExportCsvQueryOptions = <TData = Awaited<ReturnType<typeof reportsControllerExportCsv>>, TError = ErrorType<unknown>>(params: ReportsControllerExportCsvParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof reportsControllerExportCsv>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getReportsControllerExportCsvQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof reportsControllerExportCsv>>> = ({ signal }) => reportsControllerExportCsv(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof reportsControllerExportCsv>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ReportsControllerExportCsvQueryResult = NonNullable<Awaited<ReturnType<typeof reportsControllerExportCsv>>>
export type ReportsControllerExportCsvQueryError = ErrorType<unknown>


export function useReportsControllerExportCsv<TData = Awaited<ReturnType<typeof reportsControllerExportCsv>>, TError = ErrorType<unknown>>(
 params: ReportsControllerExportCsvParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof reportsControllerExportCsv>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof reportsControllerExportCsv>>,
          TError,
          Awaited<ReturnType<typeof reportsControllerExportCsv>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useReportsControllerExportCsv<TData = Awaited<ReturnType<typeof reportsControllerExportCsv>>, TError = ErrorType<unknown>>(
 params: ReportsControllerExportCsvParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof reportsControllerExportCsv>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof reportsControllerExportCsv>>,
          TError,
          Awaited<ReturnType<typeof reportsControllerExportCsv>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useReportsControllerExportCsv<TData = Awaited<ReturnType<typeof reportsControllerExportCsv>>, TError = ErrorType<unknown>>(
 params: ReportsControllerExportCsvParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof reportsControllerExportCsv>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useReportsControllerExportCsv<TData = Awaited<ReturnType<typeof reportsControllerExportCsv>>, TError = ErrorType<unknown>>(
 params: ReportsControllerExportCsvParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof reportsControllerExportCsv>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getReportsControllerExportCsvQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getSettingsControllerGetUrl = () => {




  return `/api/settings/business`
}

export const settingsControllerGet = async ( options?: RequestInit): Promise<BusinessSettingsResponseDto> => {

  return customFetch<BusinessSettingsResponseDto>(getSettingsControllerGetUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getSettingsControllerGetQueryKey = () => {
    return [
    `/api/settings/business`
    ] as const;
    }


export const getSettingsControllerGetQueryOptions = <TData = Awaited<ReturnType<typeof settingsControllerGet>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof settingsControllerGet>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getSettingsControllerGetQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof settingsControllerGet>>> = ({ signal }) => settingsControllerGet({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof settingsControllerGet>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type SettingsControllerGetQueryResult = NonNullable<Awaited<ReturnType<typeof settingsControllerGet>>>
export type SettingsControllerGetQueryError = ErrorType<unknown>


export function useSettingsControllerGet<TData = Awaited<ReturnType<typeof settingsControllerGet>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof settingsControllerGet>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof settingsControllerGet>>,
          TError,
          Awaited<ReturnType<typeof settingsControllerGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useSettingsControllerGet<TData = Awaited<ReturnType<typeof settingsControllerGet>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof settingsControllerGet>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof settingsControllerGet>>,
          TError,
          Awaited<ReturnType<typeof settingsControllerGet>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useSettingsControllerGet<TData = Awaited<ReturnType<typeof settingsControllerGet>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof settingsControllerGet>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useSettingsControllerGet<TData = Awaited<ReturnType<typeof settingsControllerGet>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof settingsControllerGet>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getSettingsControllerGetQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getSettingsControllerUpdateUrl = () => {




  return `/api/settings/business`
}

export const settingsControllerUpdate = async (updateBusinessSettingsDto: UpdateBusinessSettingsDto, options?: RequestInit): Promise<BusinessSettingsResponseDto> => {

  return customFetch<BusinessSettingsResponseDto>(getSettingsControllerUpdateUrl(),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(updateBusinessSettingsDto)
  }
);}




export const getSettingsControllerUpdateMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof settingsControllerUpdate>>, TError,{data: BodyType<UpdateBusinessSettingsDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof settingsControllerUpdate>>, TError,{data: BodyType<UpdateBusinessSettingsDto>}, TContext> => {

const mutationKey = ['settingsControllerUpdate'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof settingsControllerUpdate>>, {data: BodyType<UpdateBusinessSettingsDto>}> = (props) => {
          const {data} = props ?? {};

          return  settingsControllerUpdate(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type SettingsControllerUpdateMutationResult = NonNullable<Awaited<ReturnType<typeof settingsControllerUpdate>>>
    export type SettingsControllerUpdateMutationBody = BodyType<UpdateBusinessSettingsDto>
    export type SettingsControllerUpdateMutationError = ErrorType<unknown>

    export const useSettingsControllerUpdate = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof settingsControllerUpdate>>, TError,{data: BodyType<UpdateBusinessSettingsDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof settingsControllerUpdate>>,
        TError,
        {data: BodyType<UpdateBusinessSettingsDto>},
        TContext
      > => {
      return useMutation(getSettingsControllerUpdateMutationOptions(options), queryClient);
    }

export const getUsersControllerFindAllUrl = () => {




  return `/api/users`
}

export const usersControllerFindAll = async ( options?: RequestInit): Promise<UserListResponseDto> => {

  return customFetch<UserListResponseDto>(getUsersControllerFindAllUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getUsersControllerFindAllQueryKey = () => {
    return [
    `/api/users`
    ] as const;
    }


export const getUsersControllerFindAllQueryOptions = <TData = Awaited<ReturnType<typeof usersControllerFindAll>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof usersControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getUsersControllerFindAllQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof usersControllerFindAll>>> = ({ signal }) => usersControllerFindAll({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof usersControllerFindAll>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type UsersControllerFindAllQueryResult = NonNullable<Awaited<ReturnType<typeof usersControllerFindAll>>>
export type UsersControllerFindAllQueryError = ErrorType<unknown>


export function useUsersControllerFindAll<TData = Awaited<ReturnType<typeof usersControllerFindAll>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof usersControllerFindAll>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof usersControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof usersControllerFindAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUsersControllerFindAll<TData = Awaited<ReturnType<typeof usersControllerFindAll>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof usersControllerFindAll>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof usersControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof usersControllerFindAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUsersControllerFindAll<TData = Awaited<ReturnType<typeof usersControllerFindAll>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof usersControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useUsersControllerFindAll<TData = Awaited<ReturnType<typeof usersControllerFindAll>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof usersControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getUsersControllerFindAllQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getUsersControllerUpdateRoleUrl = (id: string,) => {




  return `/api/users/${id}/role`
}

export const usersControllerUpdateRole = async (id: string,
    updateUserRoleDto: UpdateUserRoleDto, options?: RequestInit): Promise<UserRoleResponseDto> => {

  return customFetch<UserRoleResponseDto>(getUsersControllerUpdateRoleUrl(id),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(updateUserRoleDto)
  }
);}




export const getUsersControllerUpdateRoleMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof usersControllerUpdateRole>>, TError,{id: string;data: BodyType<UpdateUserRoleDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof usersControllerUpdateRole>>, TError,{id: string;data: BodyType<UpdateUserRoleDto>}, TContext> => {

const mutationKey = ['usersControllerUpdateRole'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof usersControllerUpdateRole>>, {id: string;data: BodyType<UpdateUserRoleDto>}> = (props) => {
          const {id,data} = props ?? {};

          return  usersControllerUpdateRole(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type UsersControllerUpdateRoleMutationResult = NonNullable<Awaited<ReturnType<typeof usersControllerUpdateRole>>>
    export type UsersControllerUpdateRoleMutationBody = BodyType<UpdateUserRoleDto>
    export type UsersControllerUpdateRoleMutationError = ErrorType<unknown>

    export const useUsersControllerUpdateRole = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof usersControllerUpdateRole>>, TError,{id: string;data: BodyType<UpdateUserRoleDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof usersControllerUpdateRole>>,
        TError,
        {id: string;data: BodyType<UpdateUserRoleDto>},
        TContext
      > => {
      return useMutation(getUsersControllerUpdateRoleMutationOptions(options), queryClient);
    }

export const getUsersControllerRemoveUrl = (id: string,) => {




  return `/api/users/${id}`
}

export const usersControllerRemove = async (id: string, options?: RequestInit): Promise<DeleteResponseDto> => {

  return customFetch<DeleteResponseDto>(getUsersControllerRemoveUrl(id),
  {
    ...options,
    method: 'DELETE'


  }
);}




export const getUsersControllerRemoveMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof usersControllerRemove>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof usersControllerRemove>>, TError,{id: string}, TContext> => {

const mutationKey = ['usersControllerRemove'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof usersControllerRemove>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  usersControllerRemove(id,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type UsersControllerRemoveMutationResult = NonNullable<Awaited<ReturnType<typeof usersControllerRemove>>>

    export type UsersControllerRemoveMutationError = ErrorType<unknown>

    export const useUsersControllerRemove = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof usersControllerRemove>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof usersControllerRemove>>,
        TError,
        {id: string},
        TContext
      > => {
      return useMutation(getUsersControllerRemoveMutationOptions(options), queryClient);
    }

export const getInvitesControllerCreateUrl = () => {




  return `/api/invites`
}

export const invitesControllerCreate = async ( options?: RequestInit): Promise<InviteCreatedResponseDto> => {

  return customFetch<InviteCreatedResponseDto>(getInvitesControllerCreateUrl(),
  {
    ...options,
    method: 'POST'


  }
);}




export const getInvitesControllerCreateMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof invitesControllerCreate>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof invitesControllerCreate>>, TError,void, TContext> => {

const mutationKey = ['invitesControllerCreate'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof invitesControllerCreate>>, void> = () => {


          return  invitesControllerCreate(requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type InvitesControllerCreateMutationResult = NonNullable<Awaited<ReturnType<typeof invitesControllerCreate>>>

    export type InvitesControllerCreateMutationError = ErrorType<unknown>

    export const useInvitesControllerCreate = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof invitesControllerCreate>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof invitesControllerCreate>>,
        TError,
        void,
        TContext
      > => {
      return useMutation(getInvitesControllerCreateMutationOptions(options), queryClient);
    }

export const getInvitesControllerFindAllUrl = () => {




  return `/api/invites`
}

export const invitesControllerFindAll = async ( options?: RequestInit): Promise<InviteListResponseDto> => {

  return customFetch<InviteListResponseDto>(getInvitesControllerFindAllUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getInvitesControllerFindAllQueryKey = () => {
    return [
    `/api/invites`
    ] as const;
    }


export const getInvitesControllerFindAllQueryOptions = <TData = Awaited<ReturnType<typeof invitesControllerFindAll>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof invitesControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getInvitesControllerFindAllQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof invitesControllerFindAll>>> = ({ signal }) => invitesControllerFindAll({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof invitesControllerFindAll>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type InvitesControllerFindAllQueryResult = NonNullable<Awaited<ReturnType<typeof invitesControllerFindAll>>>
export type InvitesControllerFindAllQueryError = ErrorType<unknown>


export function useInvitesControllerFindAll<TData = Awaited<ReturnType<typeof invitesControllerFindAll>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof invitesControllerFindAll>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof invitesControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof invitesControllerFindAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useInvitesControllerFindAll<TData = Awaited<ReturnType<typeof invitesControllerFindAll>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof invitesControllerFindAll>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof invitesControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof invitesControllerFindAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useInvitesControllerFindAll<TData = Awaited<ReturnType<typeof invitesControllerFindAll>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof invitesControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useInvitesControllerFindAll<TData = Awaited<ReturnType<typeof invitesControllerFindAll>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof invitesControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getInvitesControllerFindAllQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getInvitesControllerRemoveUrl = (id: string,) => {




  return `/api/invites/${id}`
}

export const invitesControllerRemove = async (id: string, options?: RequestInit): Promise<InviteDeleteResponseDto> => {

  return customFetch<InviteDeleteResponseDto>(getInvitesControllerRemoveUrl(id),
  {
    ...options,
    method: 'DELETE'


  }
);}




export const getInvitesControllerRemoveMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof invitesControllerRemove>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof invitesControllerRemove>>, TError,{id: string}, TContext> => {

const mutationKey = ['invitesControllerRemove'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof invitesControllerRemove>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  invitesControllerRemove(id,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type InvitesControllerRemoveMutationResult = NonNullable<Awaited<ReturnType<typeof invitesControllerRemove>>>

    export type InvitesControllerRemoveMutationError = ErrorType<unknown>

    export const useInvitesControllerRemove = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof invitesControllerRemove>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof invitesControllerRemove>>,
        TError,
        {id: string},
        TContext
      > => {
      return useMutation(getInvitesControllerRemoveMutationOptions(options), queryClient);
    }

export const getStaffControllerFindAllUrl = (params?: StaffControllerFindAllParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/staff?${stringifiedParams}` : `/api/staff`
}

export const staffControllerFindAll = async (params?: StaffControllerFindAllParams, options?: RequestInit): Promise<StaffListResponseDto> => {

  return customFetch<StaffListResponseDto>(getStaffControllerFindAllUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getStaffControllerFindAllQueryKey = (params?: StaffControllerFindAllParams,) => {
    return [
    `/api/staff`, ...(params ? [params] : [])
    ] as const;
    }


export const getStaffControllerFindAllQueryOptions = <TData = Awaited<ReturnType<typeof staffControllerFindAll>>, TError = ErrorType<unknown>>(params?: StaffControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof staffControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getStaffControllerFindAllQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof staffControllerFindAll>>> = ({ signal }) => staffControllerFindAll(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof staffControllerFindAll>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type StaffControllerFindAllQueryResult = NonNullable<Awaited<ReturnType<typeof staffControllerFindAll>>>
export type StaffControllerFindAllQueryError = ErrorType<unknown>


export function useStaffControllerFindAll<TData = Awaited<ReturnType<typeof staffControllerFindAll>>, TError = ErrorType<unknown>>(
 params: undefined |  StaffControllerFindAllParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof staffControllerFindAll>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof staffControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof staffControllerFindAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useStaffControllerFindAll<TData = Awaited<ReturnType<typeof staffControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: StaffControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof staffControllerFindAll>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof staffControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof staffControllerFindAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useStaffControllerFindAll<TData = Awaited<ReturnType<typeof staffControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: StaffControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof staffControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useStaffControllerFindAll<TData = Awaited<ReturnType<typeof staffControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: StaffControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof staffControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getStaffControllerFindAllQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getStaffControllerCreateUrl = () => {




  return `/api/staff`
}

export const staffControllerCreate = async (createStaffDto: CreateStaffDto, options?: RequestInit): Promise<StaffResponseDto> => {

  return customFetch<StaffResponseDto>(getStaffControllerCreateUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(createStaffDto)
  }
);}




export const getStaffControllerCreateMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof staffControllerCreate>>, TError,{data: BodyType<CreateStaffDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof staffControllerCreate>>, TError,{data: BodyType<CreateStaffDto>}, TContext> => {

const mutationKey = ['staffControllerCreate'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof staffControllerCreate>>, {data: BodyType<CreateStaffDto>}> = (props) => {
          const {data} = props ?? {};

          return  staffControllerCreate(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type StaffControllerCreateMutationResult = NonNullable<Awaited<ReturnType<typeof staffControllerCreate>>>
    export type StaffControllerCreateMutationBody = BodyType<CreateStaffDto>
    export type StaffControllerCreateMutationError = ErrorType<unknown>

    export const useStaffControllerCreate = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof staffControllerCreate>>, TError,{data: BodyType<CreateStaffDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof staffControllerCreate>>,
        TError,
        {data: BodyType<CreateStaffDto>},
        TContext
      > => {
      return useMutation(getStaffControllerCreateMutationOptions(options), queryClient);
    }

export const getStaffControllerFindOneUrl = (id: string,) => {




  return `/api/staff/${id}`
}

export const staffControllerFindOne = async (id: string, options?: RequestInit): Promise<StaffResponseDto> => {

  return customFetch<StaffResponseDto>(getStaffControllerFindOneUrl(id),
  {
    ...options,
    method: 'GET'


  }
);}





export const getStaffControllerFindOneQueryKey = (id: string,) => {
    return [
    `/api/staff/${id}`
    ] as const;
    }


export const getStaffControllerFindOneQueryOptions = <TData = Awaited<ReturnType<typeof staffControllerFindOne>>, TError = ErrorType<unknown>>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof staffControllerFindOne>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getStaffControllerFindOneQueryKey(id);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof staffControllerFindOne>>> = ({ signal }) => staffControllerFindOne(id, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: id !== null && id !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof staffControllerFindOne>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type StaffControllerFindOneQueryResult = NonNullable<Awaited<ReturnType<typeof staffControllerFindOne>>>
export type StaffControllerFindOneQueryError = ErrorType<unknown>


export function useStaffControllerFindOne<TData = Awaited<ReturnType<typeof staffControllerFindOne>>, TError = ErrorType<unknown>>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof staffControllerFindOne>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof staffControllerFindOne>>,
          TError,
          Awaited<ReturnType<typeof staffControllerFindOne>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useStaffControllerFindOne<TData = Awaited<ReturnType<typeof staffControllerFindOne>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof staffControllerFindOne>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof staffControllerFindOne>>,
          TError,
          Awaited<ReturnType<typeof staffControllerFindOne>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useStaffControllerFindOne<TData = Awaited<ReturnType<typeof staffControllerFindOne>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof staffControllerFindOne>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useStaffControllerFindOne<TData = Awaited<ReturnType<typeof staffControllerFindOne>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof staffControllerFindOne>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getStaffControllerFindOneQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getStaffControllerUpdateUrl = (id: string,) => {




  return `/api/staff/${id}`
}

export const staffControllerUpdate = async (id: string,
    updateStaffDto: UpdateStaffDto, options?: RequestInit): Promise<StaffResponseDto> => {

  return customFetch<StaffResponseDto>(getStaffControllerUpdateUrl(id),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(updateStaffDto)
  }
);}




export const getStaffControllerUpdateMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof staffControllerUpdate>>, TError,{id: string;data: BodyType<UpdateStaffDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof staffControllerUpdate>>, TError,{id: string;data: BodyType<UpdateStaffDto>}, TContext> => {

const mutationKey = ['staffControllerUpdate'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof staffControllerUpdate>>, {id: string;data: BodyType<UpdateStaffDto>}> = (props) => {
          const {id,data} = props ?? {};

          return  staffControllerUpdate(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type StaffControllerUpdateMutationResult = NonNullable<Awaited<ReturnType<typeof staffControllerUpdate>>>
    export type StaffControllerUpdateMutationBody = BodyType<UpdateStaffDto>
    export type StaffControllerUpdateMutationError = ErrorType<unknown>

    export const useStaffControllerUpdate = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof staffControllerUpdate>>, TError,{id: string;data: BodyType<UpdateStaffDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof staffControllerUpdate>>,
        TError,
        {id: string;data: BodyType<UpdateStaffDto>},
        TContext
      > => {
      return useMutation(getStaffControllerUpdateMutationOptions(options), queryClient);
    }

export const getShiftsControllerFindAllUrl = (params?: ShiftsControllerFindAllParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/shifts?${stringifiedParams}` : `/api/shifts`
}

export const shiftsControllerFindAll = async (params?: ShiftsControllerFindAllParams, options?: RequestInit): Promise<ShiftListResponseDto> => {

  return customFetch<ShiftListResponseDto>(getShiftsControllerFindAllUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getShiftsControllerFindAllQueryKey = (params?: ShiftsControllerFindAllParams,) => {
    return [
    `/api/shifts`, ...(params ? [params] : [])
    ] as const;
    }


export const getShiftsControllerFindAllQueryOptions = <TData = Awaited<ReturnType<typeof shiftsControllerFindAll>>, TError = ErrorType<unknown>>(params?: ShiftsControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof shiftsControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getShiftsControllerFindAllQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof shiftsControllerFindAll>>> = ({ signal }) => shiftsControllerFindAll(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof shiftsControllerFindAll>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ShiftsControllerFindAllQueryResult = NonNullable<Awaited<ReturnType<typeof shiftsControllerFindAll>>>
export type ShiftsControllerFindAllQueryError = ErrorType<unknown>


export function useShiftsControllerFindAll<TData = Awaited<ReturnType<typeof shiftsControllerFindAll>>, TError = ErrorType<unknown>>(
 params: undefined |  ShiftsControllerFindAllParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof shiftsControllerFindAll>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof shiftsControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof shiftsControllerFindAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useShiftsControllerFindAll<TData = Awaited<ReturnType<typeof shiftsControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: ShiftsControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof shiftsControllerFindAll>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof shiftsControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof shiftsControllerFindAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useShiftsControllerFindAll<TData = Awaited<ReturnType<typeof shiftsControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: ShiftsControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof shiftsControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useShiftsControllerFindAll<TData = Awaited<ReturnType<typeof shiftsControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: ShiftsControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof shiftsControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getShiftsControllerFindAllQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getShiftsControllerCreateUrl = () => {




  return `/api/shifts`
}

export const shiftsControllerCreate = async (createShiftDto: CreateShiftDto, options?: RequestInit): Promise<ShiftResponseDto> => {

  return customFetch<ShiftResponseDto>(getShiftsControllerCreateUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(createShiftDto)
  }
);}




export const getShiftsControllerCreateMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof shiftsControllerCreate>>, TError,{data: BodyType<CreateShiftDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof shiftsControllerCreate>>, TError,{data: BodyType<CreateShiftDto>}, TContext> => {

const mutationKey = ['shiftsControllerCreate'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof shiftsControllerCreate>>, {data: BodyType<CreateShiftDto>}> = (props) => {
          const {data} = props ?? {};

          return  shiftsControllerCreate(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ShiftsControllerCreateMutationResult = NonNullable<Awaited<ReturnType<typeof shiftsControllerCreate>>>
    export type ShiftsControllerCreateMutationBody = BodyType<CreateShiftDto>
    export type ShiftsControllerCreateMutationError = ErrorType<unknown>

    export const useShiftsControllerCreate = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof shiftsControllerCreate>>, TError,{data: BodyType<CreateShiftDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof shiftsControllerCreate>>,
        TError,
        {data: BodyType<CreateShiftDto>},
        TContext
      > => {
      return useMutation(getShiftsControllerCreateMutationOptions(options), queryClient);
    }

export const getShiftsControllerCopyWeekUrl = () => {




  return `/api/shifts/copy-week`
}

/**
 * @summary Bir haftanın vardiyalarını başka bir haftaya kopyalar. Çakışanlar ve pasif personel atlanır.
 */
export const shiftsControllerCopyWeek = async (copyWeekDto: CopyWeekDto, options?: RequestInit): Promise<CopyWeekResponseDto> => {

  return customFetch<CopyWeekResponseDto>(getShiftsControllerCopyWeekUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(copyWeekDto)
  }
);}




export const getShiftsControllerCopyWeekMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof shiftsControllerCopyWeek>>, TError,{data: BodyType<CopyWeekDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof shiftsControllerCopyWeek>>, TError,{data: BodyType<CopyWeekDto>}, TContext> => {

const mutationKey = ['shiftsControllerCopyWeek'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof shiftsControllerCopyWeek>>, {data: BodyType<CopyWeekDto>}> = (props) => {
          const {data} = props ?? {};

          return  shiftsControllerCopyWeek(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ShiftsControllerCopyWeekMutationResult = NonNullable<Awaited<ReturnType<typeof shiftsControllerCopyWeek>>>
    export type ShiftsControllerCopyWeekMutationBody = BodyType<CopyWeekDto>
    export type ShiftsControllerCopyWeekMutationError = ErrorType<unknown>

    /**
 * @summary Bir haftanın vardiyalarını başka bir haftaya kopyalar. Çakışanlar ve pasif personel atlanır.
 */
export const useShiftsControllerCopyWeek = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof shiftsControllerCopyWeek>>, TError,{data: BodyType<CopyWeekDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof shiftsControllerCopyWeek>>,
        TError,
        {data: BodyType<CopyWeekDto>},
        TContext
      > => {
      return useMutation(getShiftsControllerCopyWeekMutationOptions(options), queryClient);
    }

export const getShiftsControllerUpdateUrl = (id: string,) => {




  return `/api/shifts/${id}`
}

export const shiftsControllerUpdate = async (id: string,
    updateShiftDto: UpdateShiftDto, options?: RequestInit): Promise<ShiftResponseDto> => {

  return customFetch<ShiftResponseDto>(getShiftsControllerUpdateUrl(id),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(updateShiftDto)
  }
);}




export const getShiftsControllerUpdateMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof shiftsControllerUpdate>>, TError,{id: string;data: BodyType<UpdateShiftDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof shiftsControllerUpdate>>, TError,{id: string;data: BodyType<UpdateShiftDto>}, TContext> => {

const mutationKey = ['shiftsControllerUpdate'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof shiftsControllerUpdate>>, {id: string;data: BodyType<UpdateShiftDto>}> = (props) => {
          const {id,data} = props ?? {};

          return  shiftsControllerUpdate(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ShiftsControllerUpdateMutationResult = NonNullable<Awaited<ReturnType<typeof shiftsControllerUpdate>>>
    export type ShiftsControllerUpdateMutationBody = BodyType<UpdateShiftDto>
    export type ShiftsControllerUpdateMutationError = ErrorType<unknown>

    export const useShiftsControllerUpdate = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof shiftsControllerUpdate>>, TError,{id: string;data: BodyType<UpdateShiftDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof shiftsControllerUpdate>>,
        TError,
        {id: string;data: BodyType<UpdateShiftDto>},
        TContext
      > => {
      return useMutation(getShiftsControllerUpdateMutationOptions(options), queryClient);
    }

export const getShiftsControllerRemoveUrl = (id: string,) => {




  return `/api/shifts/${id}`
}

export const shiftsControllerRemove = async (id: string, options?: RequestInit): Promise<DeleteShiftResponseDto> => {

  return customFetch<DeleteShiftResponseDto>(getShiftsControllerRemoveUrl(id),
  {
    ...options,
    method: 'DELETE'


  }
);}




export const getShiftsControllerRemoveMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof shiftsControllerRemove>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof shiftsControllerRemove>>, TError,{id: string}, TContext> => {

const mutationKey = ['shiftsControllerRemove'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof shiftsControllerRemove>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  shiftsControllerRemove(id,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ShiftsControllerRemoveMutationResult = NonNullable<Awaited<ReturnType<typeof shiftsControllerRemove>>>

    export type ShiftsControllerRemoveMutationError = ErrorType<unknown>

    export const useShiftsControllerRemove = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof shiftsControllerRemove>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof shiftsControllerRemove>>,
        TError,
        {id: string},
        TContext
      > => {
      return useMutation(getShiftsControllerRemoveMutationOptions(options), queryClient);
    }

export const getShiftTemplatesControllerFindAllUrl = () => {




  return `/api/shift-templates`
}

export const shiftTemplatesControllerFindAll = async ( options?: RequestInit): Promise<ShiftTemplateListResponseDto> => {

  return customFetch<ShiftTemplateListResponseDto>(getShiftTemplatesControllerFindAllUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getShiftTemplatesControllerFindAllQueryKey = () => {
    return [
    `/api/shift-templates`
    ] as const;
    }


export const getShiftTemplatesControllerFindAllQueryOptions = <TData = Awaited<ReturnType<typeof shiftTemplatesControllerFindAll>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof shiftTemplatesControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getShiftTemplatesControllerFindAllQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof shiftTemplatesControllerFindAll>>> = ({ signal }) => shiftTemplatesControllerFindAll({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof shiftTemplatesControllerFindAll>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ShiftTemplatesControllerFindAllQueryResult = NonNullable<Awaited<ReturnType<typeof shiftTemplatesControllerFindAll>>>
export type ShiftTemplatesControllerFindAllQueryError = ErrorType<unknown>


export function useShiftTemplatesControllerFindAll<TData = Awaited<ReturnType<typeof shiftTemplatesControllerFindAll>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof shiftTemplatesControllerFindAll>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof shiftTemplatesControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof shiftTemplatesControllerFindAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useShiftTemplatesControllerFindAll<TData = Awaited<ReturnType<typeof shiftTemplatesControllerFindAll>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof shiftTemplatesControllerFindAll>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof shiftTemplatesControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof shiftTemplatesControllerFindAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useShiftTemplatesControllerFindAll<TData = Awaited<ReturnType<typeof shiftTemplatesControllerFindAll>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof shiftTemplatesControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useShiftTemplatesControllerFindAll<TData = Awaited<ReturnType<typeof shiftTemplatesControllerFindAll>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof shiftTemplatesControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getShiftTemplatesControllerFindAllQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getShiftTemplatesControllerCreateUrl = () => {




  return `/api/shift-templates`
}

export const shiftTemplatesControllerCreate = async (createShiftTemplateDto: CreateShiftTemplateDto, options?: RequestInit): Promise<ShiftTemplateResponseDto> => {

  return customFetch<ShiftTemplateResponseDto>(getShiftTemplatesControllerCreateUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(createShiftTemplateDto)
  }
);}




export const getShiftTemplatesControllerCreateMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof shiftTemplatesControllerCreate>>, TError,{data: BodyType<CreateShiftTemplateDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof shiftTemplatesControllerCreate>>, TError,{data: BodyType<CreateShiftTemplateDto>}, TContext> => {

const mutationKey = ['shiftTemplatesControllerCreate'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof shiftTemplatesControllerCreate>>, {data: BodyType<CreateShiftTemplateDto>}> = (props) => {
          const {data} = props ?? {};

          return  shiftTemplatesControllerCreate(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ShiftTemplatesControllerCreateMutationResult = NonNullable<Awaited<ReturnType<typeof shiftTemplatesControllerCreate>>>
    export type ShiftTemplatesControllerCreateMutationBody = BodyType<CreateShiftTemplateDto>
    export type ShiftTemplatesControllerCreateMutationError = ErrorType<unknown>

    export const useShiftTemplatesControllerCreate = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof shiftTemplatesControllerCreate>>, TError,{data: BodyType<CreateShiftTemplateDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof shiftTemplatesControllerCreate>>,
        TError,
        {data: BodyType<CreateShiftTemplateDto>},
        TContext
      > => {
      return useMutation(getShiftTemplatesControllerCreateMutationOptions(options), queryClient);
    }

export const getShiftTemplatesControllerUpdateUrl = (id: string,) => {




  return `/api/shift-templates/${id}`
}

export const shiftTemplatesControllerUpdate = async (id: string,
    updateShiftTemplateDto: UpdateShiftTemplateDto, options?: RequestInit): Promise<ShiftTemplateResponseDto> => {

  return customFetch<ShiftTemplateResponseDto>(getShiftTemplatesControllerUpdateUrl(id),
  {
    ...options,
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(updateShiftTemplateDto)
  }
);}




export const getShiftTemplatesControllerUpdateMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof shiftTemplatesControllerUpdate>>, TError,{id: string;data: BodyType<UpdateShiftTemplateDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof shiftTemplatesControllerUpdate>>, TError,{id: string;data: BodyType<UpdateShiftTemplateDto>}, TContext> => {

const mutationKey = ['shiftTemplatesControllerUpdate'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof shiftTemplatesControllerUpdate>>, {id: string;data: BodyType<UpdateShiftTemplateDto>}> = (props) => {
          const {id,data} = props ?? {};

          return  shiftTemplatesControllerUpdate(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ShiftTemplatesControllerUpdateMutationResult = NonNullable<Awaited<ReturnType<typeof shiftTemplatesControllerUpdate>>>
    export type ShiftTemplatesControllerUpdateMutationBody = BodyType<UpdateShiftTemplateDto>
    export type ShiftTemplatesControllerUpdateMutationError = ErrorType<unknown>

    export const useShiftTemplatesControllerUpdate = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof shiftTemplatesControllerUpdate>>, TError,{id: string;data: BodyType<UpdateShiftTemplateDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof shiftTemplatesControllerUpdate>>,
        TError,
        {id: string;data: BodyType<UpdateShiftTemplateDto>},
        TContext
      > => {
      return useMutation(getShiftTemplatesControllerUpdateMutationOptions(options), queryClient);
    }

export const getShiftTemplatesControllerRemoveUrl = (id: string,) => {




  return `/api/shift-templates/${id}`
}

export const shiftTemplatesControllerRemove = async (id: string, options?: RequestInit): Promise<DeleteShiftTemplateResponseDto> => {

  return customFetch<DeleteShiftTemplateResponseDto>(getShiftTemplatesControllerRemoveUrl(id),
  {
    ...options,
    method: 'DELETE'


  }
);}




export const getShiftTemplatesControllerRemoveMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof shiftTemplatesControllerRemove>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof shiftTemplatesControllerRemove>>, TError,{id: string}, TContext> => {

const mutationKey = ['shiftTemplatesControllerRemove'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof shiftTemplatesControllerRemove>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  shiftTemplatesControllerRemove(id,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ShiftTemplatesControllerRemoveMutationResult = NonNullable<Awaited<ReturnType<typeof shiftTemplatesControllerRemove>>>

    export type ShiftTemplatesControllerRemoveMutationError = ErrorType<unknown>

    export const useShiftTemplatesControllerRemove = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof shiftTemplatesControllerRemove>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof shiftTemplatesControllerRemove>>,
        TError,
        {id: string},
        TContext
      > => {
      return useMutation(getShiftTemplatesControllerRemoveMutationOptions(options), queryClient);
    }

export const getExpensesControllerFindAllUrl = (params?: ExpensesControllerFindAllParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/expenses?${stringifiedParams}` : `/api/expenses`
}

export const expensesControllerFindAll = async (params?: ExpensesControllerFindAllParams, options?: RequestInit): Promise<ExpenseListResponseDto> => {

  return customFetch<ExpenseListResponseDto>(getExpensesControllerFindAllUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getExpensesControllerFindAllQueryKey = (params?: ExpensesControllerFindAllParams,) => {
    return [
    `/api/expenses`, ...(params ? [params] : [])
    ] as const;
    }


export const getExpensesControllerFindAllQueryOptions = <TData = Awaited<ReturnType<typeof expensesControllerFindAll>>, TError = ErrorType<unknown>>(params?: ExpensesControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof expensesControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getExpensesControllerFindAllQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof expensesControllerFindAll>>> = ({ signal }) => expensesControllerFindAll(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof expensesControllerFindAll>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ExpensesControllerFindAllQueryResult = NonNullable<Awaited<ReturnType<typeof expensesControllerFindAll>>>
export type ExpensesControllerFindAllQueryError = ErrorType<unknown>


export function useExpensesControllerFindAll<TData = Awaited<ReturnType<typeof expensesControllerFindAll>>, TError = ErrorType<unknown>>(
 params: undefined |  ExpensesControllerFindAllParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof expensesControllerFindAll>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof expensesControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof expensesControllerFindAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useExpensesControllerFindAll<TData = Awaited<ReturnType<typeof expensesControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: ExpensesControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof expensesControllerFindAll>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof expensesControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof expensesControllerFindAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useExpensesControllerFindAll<TData = Awaited<ReturnType<typeof expensesControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: ExpensesControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof expensesControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useExpensesControllerFindAll<TData = Awaited<ReturnType<typeof expensesControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: ExpensesControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof expensesControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getExpensesControllerFindAllQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getExpensesControllerCreateUrl = () => {




  return `/api/expenses`
}

export const expensesControllerCreate = async (createExpenseDto: CreateExpenseDto, options?: RequestInit): Promise<ExpenseResponseDto> => {

  return customFetch<ExpenseResponseDto>(getExpensesControllerCreateUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(createExpenseDto)
  }
);}




export const getExpensesControllerCreateMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof expensesControllerCreate>>, TError,{data: BodyType<CreateExpenseDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof expensesControllerCreate>>, TError,{data: BodyType<CreateExpenseDto>}, TContext> => {

const mutationKey = ['expensesControllerCreate'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof expensesControllerCreate>>, {data: BodyType<CreateExpenseDto>}> = (props) => {
          const {data} = props ?? {};

          return  expensesControllerCreate(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ExpensesControllerCreateMutationResult = NonNullable<Awaited<ReturnType<typeof expensesControllerCreate>>>
    export type ExpensesControllerCreateMutationBody = BodyType<CreateExpenseDto>
    export type ExpensesControllerCreateMutationError = ErrorType<unknown>

    export const useExpensesControllerCreate = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof expensesControllerCreate>>, TError,{data: BodyType<CreateExpenseDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof expensesControllerCreate>>,
        TError,
        {data: BodyType<CreateExpenseDto>},
        TContext
      > => {
      return useMutation(getExpensesControllerCreateMutationOptions(options), queryClient);
    }

export const getExpensesControllerSummaryUrl = (params?: ExpensesControllerSummaryParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/expenses/summary?${stringifiedParams}` : `/api/expenses/summary`
}

export const expensesControllerSummary = async (params?: ExpensesControllerSummaryParams, options?: RequestInit): Promise<ExpenseSummaryResponseDto> => {

  return customFetch<ExpenseSummaryResponseDto>(getExpensesControllerSummaryUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getExpensesControllerSummaryQueryKey = (params?: ExpensesControllerSummaryParams,) => {
    return [
    `/api/expenses/summary`, ...(params ? [params] : [])
    ] as const;
    }


export const getExpensesControllerSummaryQueryOptions = <TData = Awaited<ReturnType<typeof expensesControllerSummary>>, TError = ErrorType<unknown>>(params?: ExpensesControllerSummaryParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof expensesControllerSummary>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getExpensesControllerSummaryQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof expensesControllerSummary>>> = ({ signal }) => expensesControllerSummary(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof expensesControllerSummary>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ExpensesControllerSummaryQueryResult = NonNullable<Awaited<ReturnType<typeof expensesControllerSummary>>>
export type ExpensesControllerSummaryQueryError = ErrorType<unknown>


export function useExpensesControllerSummary<TData = Awaited<ReturnType<typeof expensesControllerSummary>>, TError = ErrorType<unknown>>(
 params: undefined |  ExpensesControllerSummaryParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof expensesControllerSummary>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof expensesControllerSummary>>,
          TError,
          Awaited<ReturnType<typeof expensesControllerSummary>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useExpensesControllerSummary<TData = Awaited<ReturnType<typeof expensesControllerSummary>>, TError = ErrorType<unknown>>(
 params?: ExpensesControllerSummaryParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof expensesControllerSummary>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof expensesControllerSummary>>,
          TError,
          Awaited<ReturnType<typeof expensesControllerSummary>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useExpensesControllerSummary<TData = Awaited<ReturnType<typeof expensesControllerSummary>>, TError = ErrorType<unknown>>(
 params?: ExpensesControllerSummaryParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof expensesControllerSummary>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useExpensesControllerSummary<TData = Awaited<ReturnType<typeof expensesControllerSummary>>, TError = ErrorType<unknown>>(
 params?: ExpensesControllerSummaryParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof expensesControllerSummary>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getExpensesControllerSummaryQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getExpensesControllerRemoveUrl = (id: string,) => {




  return `/api/expenses/${id}`
}

export const expensesControllerRemove = async (id: string, options?: RequestInit): Promise<DeleteExpenseResponseDto> => {

  return customFetch<DeleteExpenseResponseDto>(getExpensesControllerRemoveUrl(id),
  {
    ...options,
    method: 'DELETE'


  }
);}




export const getExpensesControllerRemoveMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof expensesControllerRemove>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof expensesControllerRemove>>, TError,{id: string}, TContext> => {

const mutationKey = ['expensesControllerRemove'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof expensesControllerRemove>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  expensesControllerRemove(id,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ExpensesControllerRemoveMutationResult = NonNullable<Awaited<ReturnType<typeof expensesControllerRemove>>>

    export type ExpensesControllerRemoveMutationError = ErrorType<unknown>

    export const useExpensesControllerRemove = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof expensesControllerRemove>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof expensesControllerRemove>>,
        TError,
        {id: string},
        TContext
      > => {
      return useMutation(getExpensesControllerRemoveMutationOptions(options), queryClient);
    }

