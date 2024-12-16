/**
 * @swagger
 * components:
 *   schemas:
 *     Asset:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         type:
 *           type: string
 *           enum: [storyboard, layout, kpi]
 *         isFavorite:
 *           type: boolean
 *         visualsAvailable:
 *           type: boolean
 *         lastViewed:
 *           type: string
 *           format: date-time
 *         viewCount:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *     Layout:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         pageCount:
 *           type: integer
 *         kpisUsed:
 *           type: array
 *           items:
 *             type: string
 *         assetId:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Storyboard:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         coupledKpis:
 *           type: array
 *           items:
 *             type: string
 *         applicableAffiliates:
 *           type: array
 *           items:
 *             type: string
 *         assetId:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Share:
 *       type: object
 *       properties:
 *         assetId:
 *           type: integer
 *         shareToken:
 *           type: string
 *         expiresAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     PaginatedResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Asset'
 *         total:
 *           type: integer
 *         page:
 *           type: integer
 *         pageSize:
 *           type: integer
 */ 