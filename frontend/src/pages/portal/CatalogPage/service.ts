import httpClient from "../../../services/httpClient";
import API_ROUTES from "../../../services/apiRoutes";

import type { CatalogData, CatalogDataPayload } from "./type";

interface GetCatalogParams {
  offset?: number;
  limit?: number;
}

export async function getCatalog(
  params: GetCatalogParams = {},
): Promise<CatalogData[]> {
  const response = await httpClient.get<CatalogData[]>(
    API_ROUTES.CATALOG.LIST,
    {
      params,
    },
  );

  return response.data;
}

export async function getCatalogById(id: number): Promise<CatalogData> {
  const response = await httpClient.get<CatalogData>(
    API_ROUTES.CATALOG.GET_BY_ID(id),
  );

  return response.data;
}

export async function createCatalog(
  payload: CatalogDataPayload,
): Promise<CatalogData> {
  const response = await httpClient.post<CatalogData>(
    API_ROUTES.CATALOG.CREATE,
    payload,
  );

  return response.data;
}

export async function updateCatalog(
  id: number,
  payload: CatalogDataPayload,
): Promise<CatalogData> {
  const response = await httpClient.put<CatalogData>(
    API_ROUTES.CATALOG.UPDATE(id),
    payload,
  );

  return response.data;
}

export async function deleteCatalog(id: number): Promise<void> {
  await httpClient.delete(API_ROUTES.CATALOG.DELETE(id));
}
