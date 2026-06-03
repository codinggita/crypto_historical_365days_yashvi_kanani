import { Router } from "express";
import {
  addBookmark,
  getBookmarks,
  getBookmarkById,
  updateBookmark,
  deleteBookmark,
  checkBookmarkStatus,
  getAnalyticsSummary,
  getTrendingBookmarks,
} from "../../controllers/bookmark.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

// Protect all routes
router.use(verifyJWT);

// High-priority and static analytical routes to avoid path collisions
router.route("/analytics/summary").get(getAnalyticsSummary);
router.route("/trending").get(getTrendingBookmarks);
router.route("/check/:coinId").get(checkBookmarkStatus);

// Base resource routes
router.route("/").get(getBookmarks);

// Add coin to bookmarks by coinId
router.route("/:coinId").post(addBookmark);

// Bookmark item-specific operations
router
  .route("/:id")
  .get(getBookmarkById)
  .patch(updateBookmark)
  .delete(deleteBookmark);

export default router;
