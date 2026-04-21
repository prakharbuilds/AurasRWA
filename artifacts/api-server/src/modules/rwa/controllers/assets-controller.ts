import type { RequestHandler } from "express";
import { CreateAssetBody, GetAssetParams, GetAssetResponse, ListAssetsQueryParams, ListAssetsResponse } from "@workspace/api-zod";
import { parseRequest } from "../../../app/utils/request-parsing";
import { createAsset, getAssetById, listAssets } from "../services/assets-service";

export const listAssetsController: RequestHandler = async (req, res) => {
  const query = parseRequest(ListAssetsQueryParams, req.query, res, "invalid_query") as any;
  if (!query) return;

  const { category, status, page = 1, limit = 20 } = query;
  const result = await listAssets({ category, status, page, limit });

  res.json(ListAssetsResponse.parse(result));
};

export const createAssetController: RequestHandler = async (req, res) => {
  const body = parseRequest(CreateAssetBody, req.body, res, "invalid_body") as any;
  if (!body) return;

  const asset = await createAsset(body);
  res.status(201).json(asset);
};

export const getAssetController: RequestHandler = async (req, res) => {
  const params = parseRequest(GetAssetParams, req.params, res, "invalid_params") as any;
  if (!params) return;

  const asset = await getAssetById(params.id);

  if (!asset) {
    res.status(404).json({ error: "not_found", message: "Asset not found" });
    return;
  }

  res.json(GetAssetResponse.parse(asset));
};
