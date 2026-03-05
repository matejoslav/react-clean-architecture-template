import { container } from "tsyringe";
import { AxiosRemoteProvider } from "../core/api/RemoteProvider";
import { BuildConfig } from "../core/config/BuildConfig";
import {
  ApiAuthenticationDataSource,
  MockAuthenticationDataSource,
} from "../data/data-source/authentication/RemoteAuthenticationDataSource";
import { LocalStorageAuthenticationDataSource } from "../data/data-source/authentication/LocalAuthenticationDataSource";
import { AppDependencies } from "./types";

const useMockApi = import.meta.env.VITE_USE_MOCK_API !== "false";

export function registerDataDependencies(): void {
  container.register(AppDependencies.ApiProvider, {
    useValue: new AxiosRemoteProvider({ baseURL: BuildConfig.ApiUrl }),
  });

  container.register(AppDependencies.LocalAuthenticationDataSource, {
    useClass: LocalStorageAuthenticationDataSource,
  });

  container.register(AppDependencies.RemoteAuthenticationDataSource, {
    // temporary workaround for e2e tests, should be removed
    useClass: useMockApi
      ? MockAuthenticationDataSource
      : ApiAuthenticationDataSource,
  });
}
