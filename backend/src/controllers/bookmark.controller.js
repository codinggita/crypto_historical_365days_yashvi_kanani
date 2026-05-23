import * as bookmarkService from "../services/bookmark.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

/**
 * Add coin to watchlist/bookmarks
 */
export const addBookmark = asyncHandler(async (req, res) => {
  const bookmark = await bookmarkService.addBookmark(
    req.user._id,
    req.params.coinId,
    req.body
  );

  return res
    .status(201)
    .json(new ApiResponse(201, bookmark, "Coin added to watchlist successfully"));
});

/**
 * Get logged-in user bookmarks
 */
export const getBookmarks = asyncHandler(async (req, res) => {
  const { items, meta } = await bookmarkService.getBookmarks(
    req.user._id,
    req.query
  );

  return res
    .status(200)
    .json(new ApiResponse(200, items, "Bookmarks fetched successfully", meta));
});

/**
 * Get single bookmarked coin
 */
export const getBookmarkById = asyncHandler(async (req, res) => {
  const bookmark = await bookmarkService.getBookmarkById(
    req.user._id,
    req.params.id
  );

  return res
    .status(200)
    .json(new ApiResponse(200, bookmark, "Bookmark fetched successfully"));
});

/**
 * Update bookmark notes and category
 */
export const updateBookmark = asyncHandler(async (req, res) => {
  const bookmark = await bookmarkService.updateBookmark(
    req.user._id,
    req.params.id,
    req.body
  );

  return res
    .status(200)
    .json(new ApiResponse(200, bookmark, "Bookmark updated successfully"));
});

/**
 * Remove bookmark/watchlist item
 */
export const deleteBookmark = asyncHandler(async (req, res) => {
  const bookmark = await bookmarkService.deleteBookmark(
    req.user._id,
    req.params.id
  );

  return res
    .status(200)
    .json(new ApiResponse(200, bookmark, "Bookmark removed successfully"));
});

/**
 * Check if coin already bookmarked
 */
export const checkBookmarkStatus = asyncHandler(async (req, res) => {
  const status = await bookmarkService.checkBookmarkStatus(
    req.user._id,
    req.params.coinId
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, status, "Bookmark status checked successfully")
    );
});

/**
 * Get bookmark analytics summary for user
 */
export const getAnalyticsSummary = asyncHandler(async (req, res) => {
  const summary = await bookmarkService.getAnalyticsSummary(req.user._id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        summary,
        "Bookmark analytics summary fetched successfully"
      )
    );
});

/**
 * Get globally trending bookmarks
 */
export const getTrendingBookmarks = asyncHandler(async (req, res) => {
  const limit = req.query.limit || 5;
  const trending = await bookmarkService.getTrendingBookmarks(limit);

  return res
    .status(200)
    .json(
      new ApiResponse(200, trending, "Trending bookmarks fetched successfully")
    );
});
