// Type definitions for noblox.js@4.8.0-0
// Authored by Gamenew09 w/ changes by suufi

declare module "noblox.js" {
    // Interfaces/Types
    import * as events from "events";
    import * as stream from "stream";

    /**
     * request
     */
    interface CookieJar {
        session?: string;
    }

    /**
     * NobloxOptions for setOptions, based from settings.json
     */
    interface NobloxOptions {
        /** Prints console warnings for functions that are being polyfilled by newer methods due to upstream Roblox API changes */
        show_deprecation_warnings: boolean;

        /** Minimizes data usage and speed up requests by only saving session cookies, disable if you need other cookies to be saved as well. (Default: true) */
        session_only: boolean;

        /** This is usually used for functions that have to receive a lot of pages at once. Only this amount will be queued up as to preserve memory, make this as high as possible for fastest responses (although it will be somewhat limited by maxSockets). (Default: 50) */
        max_threads: number;

        /** Timeout for http requests. This is necessary for functions that make a very large number of requests, where it is possible some simply won't connect. (Default: 10000) */
        timeout: number;

        event: {
            /** Maximum number of consecutive retries after an event times out or fails in some other way. (Default: 5) */
            maxRetries: number;
            /** Maximum time (in milliseconds) a request can take. If your server has extremely high latency you may have to raise this. (Default: 10000) */
            timeout: number;
            /** The poll time in milliseconds by default. A lower number will detect changes much quicker but will stress the network, a higher one does the opposite. (Default: 10000) */
            defaultDelay: number;
            /** The poll time in milliseconds to check for new audit log entries. A lower number will detect changes much quicker but will stress the network, a higher one does the opposite. (Default: 10000) */
            onAuditLog: number;
            /** The poll time in milliseconds to check for new wall posts. A lower number will detect changes much quicker but will stress the network, a higher one does the opposite. (Default: 10000) */
            onWallPost: number;
            /** The poll time in milliseconds to check for new join requests. A lower number will detect changes much quicker but will stress the network, a higher one does the opposite. (Default: 10000) */
            onJoinRequestHandle: number;
            /** The poll time in milliseconds to check for new join requests. A lower number will detect changes much quicker but will stress the network, a higher one does the opposite. (Default: 10000) */
            onJoinRequest: number;
            /** The poll time in milliseconds to check for a new shout message. A lower number will detect changes much quicker but will stress the network, a higher one does the opposite. (Default: 10000) */
            onShout: number;
            /** The poll time in milliseconds to check for a new blurb message. A lower number will detect changes much quicker but will stress the network, a higher one does the opposite. (Default: 10000) */
            onBlurbChange: number;
            /** The poll time in milliseconds to check for new transaction log entries. A lower number will detect changes much quicker but will stress the network, a higher one does the opposite. This endpoint has a low rate limit. (Default: 30000) */
            onGroupTransaction: number;
        }

        thumbnail: {
            /** Maximum number of retries to retrieve a pending thumbnail, rare, but occurs with uncached users (Roblox's cache) (Default: 2) */
            maxRetries: number;
            /** The time to wait between consecutive retries of retrieving pending thumbnails. (Default: 500) */
            retryDelay: number;

            failedUrl: {
                /** The image URL to provide when an asset thumbnail is still pending; defaults to Roblox moderation icon via noblox.js's GitHub repo at https://noblox.js.org/moderatedThumbnails/moderatedThumbnail_{size}.png */
                pending: string;
                /** The image URL to provide when an asset thumbnail has been moderated by Roblox; defaults to Roblox moderation icon via noblox.js's GitHub repo at https://noblox.js.org/moderatedThumbnails/moderatedThumbnail_{size}.png */
                blocked: string;
            }
        }

        queue: {
            Message: {
                /** Although messages do have a floodcheck, it is not instituted immediately so this is disabled by default. If you are sending a lot of messages set a delay around 10-15 seconds (10000-15000). (Default: 0) */
                delay: number
            }
        }

        cache: {
            /** XCSRF tokens expire 30 minutes after being created. Until they expire, however, no new tokens can be made. Sometimes an XCSRF token has already been created for the user so the server doesn't know when to collect a new one. During transitions some requests may use invalid tokens. For now, new XCSRF tokens are automatically retrieved when cached ones get rejected. */
            XCSRF: {
                /** Default: 1800 */
                expire: number | boolean;
                /** Default: false */
                refresh: number | boolean;
            },

            /** Verification tokens seem to last extremely long times. */
            Verify: {
                /** Default: 7200 */
                expire: number | boolean;
                /** Default: 3600 */
                refresh: number | boolean;
            },

            /** This should be fine unless your group changes its ranks often. */
            Roles: {
                /** Default: 600 */
                expire: number | boolean;
                /** Default: true */
                refresh: number | boolean;
            },

            /** Disable this completely if you don't plan on ever changing your exile bot's rank. */
            RolesetId: {
                /** Default: 86400 */
                expire: number | boolean;
                /** Default: false */
                refresh: number | boolean;
            },

            /** Disabled by default for security (price checks). If you are only working with ROBLOX assets, however, you can set this to something high (since ROBLOX product info rarely changes). */
            Product: {
                /** Default: false */
                expire: number | boolean;
                /** Default: false */
                refresh: number | boolean;
            },

            /** Caches a user's username based on their ID. It is not on by default because it is an uncontrollable change but the option is there to cache it if you would like. */
            NameFromID: {
                /** Default: false */
                expire: number | boolean;
                /** Default: false */
                refresh: number | boolean;
            },

            /** Permanent cache for a user's ID based on their name. There is no reason this would ever change (changing names would re-match it and old names cannot be reused by other accounts). Only disable if you want this to match current names only. */
            IDFromName: {
                /** Default: true */
                expire: number | boolean;
                /** Default: false */
                refresh: number | boolean;
            },

            /** Permanent cache for the sender's user ID. This should literally never change. */
            SenderId: {
                /** Default: true */
                expire: number | boolean;
                /** Default: false */
                refresh: number | boolean;
            },

            /** Caches rank by user ID. Changes cannot be anticipated so this is not enabled by default. */
            Rank: {
                /** Default: false */
                expire: number | boolean;
                /** Default: false */
                refresh: number | boolean;
            }
        }
    }

    /// Asset

    /**
     * shirts = 11
     * pants = 12
     * decals = 13
     */
    type UploadItemAssetType = 11 | 12 | 13;

    interface ProductInfoCreator {
        Id: number;
        Name: string;
        HasVerifiedBadge: boolean;
    }

    interface IGroupPartial {
        Name: string,
        Id: number,
        EmblemUrl: string,
        MemberCount: number,
        Rank: number,
        Role: string,
        RoleId: number,
        IsPrimary: boolean,
    }

    interface GroupGameInfo {
        id: number;
        name: string;
        description?: string;
        creator: { id: number; type: string; };
        rootPlace: { id: number; type: string; };
        created: Date;
        updated: Date;
        placeVisits: number;
    }

    interface GroupAssetInfo {
        assetId: number;
        name: string;
    }

    interface ProductInfo {
        TargetId: number;
        ProductType?: string;
        AssetId: number;
        ProductId: number;
        Name: string
        Description: string;
        AssetTypeId: number;
        Creator: ProductInfoCreator;
        IconImageAssetId: number;
        Created: Date;
        Updated: Date;
        PriceInRobux?: number;
        PriceInTickets?: number;
        Sales: number;
        IsNew: boolean;
        IsForSale: boolean;
        IsPublicDomain: boolean;
        IsLimited: boolean;
        IsLimitedUnique: boolean;
        Remaining?: number;
        MinimumMembershipLevel: number;
        ContentRatingTypeId: number;
        SaleAvailabilityLocations?: string[];
        SaleLocation?: string;
        CollectibleItemId?: number;
    }

    type GamePassProductInfo = Omit<ProductInfo, "ContentRatingTypeId" | "SaleAvailabilityLocations" | "SaleLocation" | "CollectibleItemId">;

    interface PriceRange {
        high: number;
        low: number;
    }

    interface ChartDataPointResponse {
        value?: number;
        date?: Date;
    }

    interface ResaleDataResponse {
        assetStock?: number;
        sales?: number;
        numberRemaining?: number;
        recentAveragePrice?: number;
        originalPrice?: number;
        priceDataPoints?: ChartDataPointResponse[];
        volumeDataPoints?: ChartDataPointResponse[];
    }

    interface ResellerAgent {
        id: number;
        type: "User" | "Group";
        name: string;
    }

    interface ResellerData {
        userAssetId: number;
        seller: ResellerAgent;
        price: number;
        serialNumber?: number;
    }

    interface ThumbnailRequest {
        requestId?: string;
        targetId?: number;
        token?: string;
        alias?: string;
        type: 'Avatar' | 'AvatarHeadShot' | 'GameIcon' | 'BadgeIcon' | 'GameThumbnail' | 'GamePass' | 'Asset' | 'BundleThumbnail' | 'Outfit' | 'GroupIcon' | 'DeveloperProduct' | 'AutoGeneratedAsset' | 'AvatarBust' | 'PlaceIcon' | 'AutoGeneratedGameIcon' | 'ForceAutoGeneratedGameIcon';
        size: string;
        format?: 'png' | 'jpeg';
        isCircular?: boolean;
    }

    interface ThumbnailData {
        requestId?: string;
        errorCode: number;
        errorMessage: string;
        targetId: number;
        state: "Completed" | "Pending" | "Blocked";
        imageUrl?: string;
    }

    interface UploadItemResponse {
        id: number;
    }

    interface UploadModelResponse {
        AssetId: number;
        AssetVersionId: number;
    }

    interface UploadModelItemOptions {
        name: string;
        description?: string;
        copyLocked?: boolean;
        allowComments?: boolean;
        groupId?: number;
    }

    interface ConfigureItemResponse {
        name: string;
        assetId: number;
        description?: string;
        price?: number;
        isCopyingAllowed?: boolean;
    }

    /// Avatar

    interface AssetTypeRulesModel {
        min: number;
        max: number;
        increment: number;
    }

    interface AvatarRulesScales {
        [scalename: string]: AssetTypeRulesModel;
    }

    interface WearableAssetType {
        maxNumber: number;
        id: number;
        name: string;
    }

    interface BodyColorModel {
        brickColorId: number;
        hexColor: string;
        name: string;
    }

    interface DefaultClothingAssetLists {
        defaultShirtAssetIds: number[];
        defaultPantAssetIds: number[];
    }

    interface AvatarRules {
        playerAvatarTypes: string[];
        scales: AvatarRulesScales;
        wearableAssetTypes: WearableAssetType[];
        bodyColorsPalette: BodyColorModel[];
        basicBodyColorsPalette: BodyColorModel[];
        minimumDeltaEBodyColorDifference: number;
        proportionsAndBodyTypeEnabledForUser: boolean;
        defaultClothingAssetLists: DefaultClothingAssetLists;
        bundlesEnabledForUser: boolean;
        emotesEnabledForUser: boolean;
    }

    interface AssetIdList {
        assetIds: number[];
    }

    interface AvatarScale {
        height: number;
        width: number;
        head: number;
        depth: number;
        proportion: number;
        bodyType: number;
    }

    interface AvatarBodyColors {
        headColorId: number;
        torsoColorId: number;
        rightArmColorId: number;
        leftArmColorId: number;
        rightLegColorId: number;
        leftLegColorId: number;
    }

    interface AvatarAssetType {
        id: number;
        name: string;
    }

    interface AvatarAsset {
        id: number;
        name: string;
        assetType: AvatarAssetType;
    }

    type PlayerAvatarType = "R6" | "R15";

    interface AvatarInfo {
        scales: AvatarScale;
        playerAvatarType: PlayerAvatarType;
        bodyColors: AvatarBodyColors;
        assets: AvatarAsset[];
        defaultShirtApplied: boolean;
        defaultPantsApplied: boolean;
    }

    type RecentItemListType = "All" | "Clothing" | "BodyParts" | "AvatarAnimations" | "Accessories" | "Outfits" | "Gear";
    type RecentItemType = "Asset" | "Outfit";

    interface AssetRecentItem {
        id: number;
        name: string;
        type: RecentItemType;
        assetType: AvatarAssetType;
        isEditable?: boolean;
    }

    interface AssetRecentItemsResult {
        data: AssetRecentItem[];
        total: number;
    }

    interface AvatarOutfitDetails {
        id: number;
        name: string;
        assets: AvatarAsset[];
        bodyColors: AvatarBodyColors[];
        scale: AvatarScale;
        playerAvatarType: PlayerAvatarType;
        isEditable: boolean;
    }

    interface AvatarOutfit {
        id: number;
        name: string;
        isEditable: boolean;
    }

    interface GetOutfitsResult {
        data: AvatarOutfit[];
        total: number;
    }

    /// Chat

    interface RejectedParticipant {
        rejectedReason: string;
        type: string;
        targetId: number;
        name: string;
        displayName: string;
    }

    interface ConversationAddResponse {
        conversationId: number;
        rejectedParticipants: RejectedParticipant[];
        resultType: string;
        statusMessage: string;
    }

    interface ConversationRemoveResponse {
        conversationId: number;
        resultType: string;
        statusMessage: string;
    }

    interface ConversationRenameResponse {
        conversationTitle: string;
        resultType: string;
        title: ChatConversationTitle;
        statusMessage: string;
    }

    interface SendChatResponse {
        content: string;
        filteredForRecievers: boolean;
        messageId: string;
        sent: string;
        messageType: string;
        resultType: string;
        statusMessage: string;
    }

    interface UpdateTypingResponse {
        statusMessage: string;
    }

    interface StartGroupConversationResponse {
        conversation: ChatConversation;
        rejectedParticipants: RejectedParticipant[];
        resultType: string;
        statusMessage: string;
    }

    interface ChatSettings {
        /**
         * Is chat enabled for the user.
         */
        chatEnabled: boolean;
        /**
         * Was the Last ChatMessage Sent within the last x days or the account was created in the last x days? Note: user is active by default unless he does not chat for more than x days after account creation
         */
        isActiveChatUser: boolean;
    }

    interface ChatMessage {
        id: string;
        senderType: "User" | "System";
        sent: string;
        read: boolean;
        messageType: "PlainText" | "Link" | "EventBased";
        decorators: string[];
        senderTargetId: number;
        content: string;
        link: ChatMessageLink;
        eventBased: ChatMessageEventBased;
    }

    interface ChatMessageLink {
        type: "Game";
        game: ChatMessageGameLink;
    }

    interface ChatMessageGameLink {
        universeId: number;
    }

    interface ChatMessageEventBased {
        type: "SetConversationUniverse";
        setConversationUniverse: ChatMessageSetConversationUniverseEventBased;
    }

    interface ChatMessageSetConversationUniverseEventBased {
        actorUserId: number;
        universeId: number;
    }

    interface ChatConversation {
        id: number;
        title: string;
        initiator: ChatParticipant;
        hasUnreadMessages: boolean;
        participants: ChatParticipant[];
        conversationType: "OneToOneConversation" | "MultiUserConversation" | "CloudEditConversation";
        conversationTitle: ChatConversationTitle;
        lastUpdated: Date;
        conversationUniverse: ChatConversationUniverse;
    }

    interface ChatParticipant {
        type: "User" | "System";
        targetId: number;
        name: string;
        displayName: string;
    }

    interface ChatConversationTitle {
        titleForViewer: string;
        isDefaultTitle: boolean;
    }

    interface ChatConversationUniverse {
        universeId: number;
        rootPlaceId: number;
    }

    type ChatFeatureNames = "LuaChat" | "ConversationUniverse" | "PlayTogether" | "Party" | "GameLink" | "OldPlayTogether";

    interface GetRolloutSettingsResult {
        rolloutFeatures: ChatRolloutFeature[];
    }

    interface ChatRolloutFeature {
        featureName: ChatFeatureNames;
        isRolloutEnabled: boolean;
    }

    interface GetUnreadConversationCountResult {
        count: number;
    }

    interface ChatConversationWithMessages {
        conversationId: number;
        chatMessages: ChatMessage[];
    }

    interface OnUserTypingChatEvent {
        UserId: number;
        ConversationId: number;
        IsTyping: boolean;
    }

    /// Game
    interface GameInstance {
        id: string;
        maxPlayers: number;
        playing: number;
        playerTokens: string[];
        fps: number;
        ping: number;
    }

    interface GamePassResponse {
        gamePassId: number,
        name?: string,
        description?: string,
        price?: number,
        isForSale?: boolean,
        iconChanged?: boolean
    }

    type SocialLinkResponse = {
        id: number;
        type: 'Facebook' | 'Twitter' | 'YouTube' | 'Twitch' | 'GooglePlus' | 'Discord' | 'RobloxGroup' | 'Amazon';
        url: string;
        title: string;
    }

    interface DeveloperProduct {
        ProductId: number,
        DeveloperProductId: number,
        Name: string,
        Description: string,
        IconImageAssetId: number,
        displayName: string,
        displayDescription: string,
        displayIcon: number,
        PriceInRobux: number
    }

    interface DeveloperProductsResult {
        DeveloperProducts: DeveloperProduct[],
        FinalPage: boolean,
        PageSize: number
    }

    interface DeveloperProductAddResult {
        id: number,
        name: string,
        Description: string, // API does not return camelCase
        shopId: number,
        iconImageAssetId: number | null
    }

    interface DeveloperProductAddError {
        errorCode: string,
        errorMessage: string,
        field: string,
        hint: string | null
    }

    interface GamePassData {
        id: number;
        name: string;
        displayName: string;
        productId?: number;
        price?: number;
    }

    type AvatarType = "MorphToR6" | "MorphToR15" | "PlayerChoice"
    type AnimationType = "Standard" | "PlayerChoice"
    type CollisionType = "InnerBox" | "OuterBox"
    type JointType = "Standard" | "ArtistIntent"

    type Genre = "All" | "Tutorial" | "Scary" | "TownAndCity" | "War" | "Funny" | "Fantasy" | "Adventure" | "SciFi" | "Pirate" | "FPS" | "RPG" | "Sports" | "Ninja" | "WildWest"
    type PlayableDevices = "Computer" | "Phone" | "Tablet" | "Console"
    type Regions = "Unknown" | "China"

    interface UniverseAsset {
        assetID: number,
        assetTypeID: number,
        isPlayerChoice: boolean
    }

    interface UniversePermissions {
        IsThirdPartyTeleportAllowed?: boolean;
        IsThirdPartyAssetAllowed?: boolean;
        IsThirdPartyPurchaseAllowed?: boolean;
    }

    interface UniverseSettings {
        allowPrivateServers?: boolean;
        privateServerPrice?: number;

        name?: string;
        description?: string;

        universeAvatarType?: AvatarType;
        universeAnimationType?: AnimationType;
        universeCollisionType?: CollisionType;
        universeJointPositioningType?: JointType;

        isArchived?: boolean;
        isFriendsOnly?: boolean;

        genre?: Genre;

        playableDevices?: Array<PlayableDevices>;
        universeAvatarAssetOverrides?: Array<UniverseAsset>;

        isForSale?: boolean;
        price?: number;

        universeAvatarMinScales?: AvatarScale
        universeAvatarMaxScales?: AvatarScale

        studioAccessToApisAllowed?: boolean;
        permissions?: UniversePermissions;

        optInRegions?: Array<Regions>;
    }

    interface UpdateUniverseResponse extends UniverseSettings {
        id: number;
    }

    interface UniverseCreator {
        id: number;
        name: string;
        type: string;
        isRNVAccount: boolean;
    }

    interface UniverseInformation {
        id: number;
        rootPlaceId: number;
        name: string;
        description: string;
        creator: UniverseCreator;
        price: number;
        allowedGearGenres: string[];
        allowedGearCategories: string[];
        isGenreEnforced: boolean;
        copyingAllowed: boolean;
        playing: number;
        visits: number;
        maxPlayers: number;
        created: Date;
        updated: Date;
        studioAccessToApisAllowed: boolean;
        createVipServersAllowed: boolean;
        universeAvatarType: AvatarType;
        genre: Genre;
        isAllGenre: boolean;
        isFavoritedByUser: boolean;
        favoritedCount: number;
    }

    interface PlaceInformation {
        placeId: number;
        name: string;
        sourceName: string;
        sourceDescription: string;
        url: string;
        builder: string;
        builderId: number;
        hasVerifiedBadge: boolean;
        isPlayable: boolean;
        reasonProhibited: string;
        universeId: number;
        universeRootPlaceId: number;
        price: number;
        imageToken: string;
    }

    /// Group

    type GroupIconSize = "150x150" | "420x420"
    type GroupIconFormat = "Png"

    interface Role {
        name: string;
        memberCount?: number;
        rank: number;
        id: number;
    }

    interface RoleWithDescription {
        name: string;
        memberCount?: number;
        rank: number;
        id: number;
        description: string;
    }

    interface GroupPostsPermissions {
        viewWall: boolean;
        postToWall: boolean;
        deleteFromWall: boolean;
        viewStatus: boolean;
        postToStatus: boolean;
    }

    interface GroupMembershipPermissions {
        changeRank: boolean;
        inviteMembers: boolean;
        removeMembers: boolean;
    }

    interface GroupManagementPermissions {
        manageRelationships: boolean;
        manageClan: boolean;
        viewAuditLogs: boolean;
    }

    interface GroupEconomyPermissions {
        spendGroupFunds: boolean;
        advertiseGroup: boolean;
        createItems: boolean;
        manageItems: boolean;
        addGroupPlaces: boolean;
        manageGroupGames: boolean;
        viewGroupPayouts: boolean;
    }

    interface RolePermissionsBody {
        groupPostsPermissions: GroupPostsPermissions;
        groupMembershipPermissions: GroupMembershipPermissions;
        groupManagementPermissions: GroupManagementPermissions;
        groupEconomyPermissions: GroupEconomyPermissions;
    }

    interface RolePermissions {
        groupId: number;
        role: RoleWithDescription;
        permissions: RolePermissionsBody
    }

    interface ChangeRankResult {
        newRole: Role;
        oldRole: Role;
    }

    interface Group {
        id: number;
        name: string;
        description: string;
        owner: GroupUser;
        shout?: GroupShout;
        memberCount: number;
        isBuildersClubOnly: boolean;
        publicEntryAllowed: boolean;
        isLocked: boolean;
    }

    interface GroupSearchItem {
        id: number;
        name: string;
        description: string;
        memberCount: number;
        publicEntryAllowed: boolean;
        created: Date;
        updated: Date;
    }

    interface GroupView {
        __VIEWSTATE: string;
        __VIEWSTATEGENERATOR: string;
        __EVENTVALIDATION: string;
        __RequestVerificationToken: string;
    }

    interface GroupUser {
        userId: number;
        username: string;
        displayName: string;
        hasVerifiedBadge?: boolean;
    }

    interface GroupShout {
        body: string;
        poster: GroupUser;
        created: Date;
        updated: Date;
    }

    interface GroupDescriptionResult {
        newDescription: string
    }

    interface GroupNameResult {
        newName: string
    }

    interface AuditItemActor {
        user: GroupUser;
        role: Role;
    }

    interface AuditItem {
        actor: AuditItemActor;
        actionType: string;
        description: object;
        created: Date;
    }

    interface AuditPage {
        data: AuditItem[];
        nextPageCursor?: string;
        previousPageCursor?: string;
    }

    interface TransactionAgent {
        id: number;
        type: string;
        name: string;
    }

    interface TransactionDetails {
        id: number;
        name: string;
        type: string;
    }

    interface TransactionCurrency {
        amount: number;
        type: string;
    }

    interface TransactionItem {
        id: number;
        transactionType?: string;
        created: Date;
        isPending: boolean;
        agent: TransactionAgent;
        details?: TransactionDetails;
        currency: TransactionCurrency;
    }

    interface GroupJoinRequester {
        userId: number;
        username: string;
        displayName: string;
    }

    interface GroupJoinRequest {
        requester: GroupJoinRequester;
        created: Date;
    }

    interface GroupJoinRequestsPage {
        previousPageCursor?: string;
        nextPageCursor?: string;
        data: GroupJoinRequest[];
    }

    interface RevenueSummaryResponse {
        recurringRobuxStipend?: number;
        itemSaleRobux?: number;
        purchasedRobux?: number;
        tradeSystemRobux?: number;
        pendingRobux?: number;
        groupPayoutRobux?: number;
        individualToGroupRobux?: number;
        premiumPayouts?: number;
        groupPremiumPayouts?: number;
        adjustmentRobux?: number;
    }

    interface WallPost {
        id: number;
        poster: {
            user: GroupUser;
            role: Role;
        };
        body: string;
        created: Date;
        updated: Date;
    }

    interface WallPostPage {
        previousPageCursor?: string;
        nextPageCursor?: string;
        data: WallPost[];
    }

    /// Party

    interface PartyData {
        PartyId: number;
        PartyType: string;
    }

    /// User

    /**
     * 0 = Inbox
     * 1 = Sent Messages
     * 3 = Archived Messages
     */
    type PrivateMessageTab = 0 | 1 | 3;

    /**
     * 0 = Offline
     * 1 = Online
     * 2 = InGame
     * 3 = Studio
     */
    type UserPresenceType = 0 | 1 | 2 | 3;

    // https://noblox.js.org/thumbnailSizes.png | Archived: https://i.imgur.com/UwiKqjs.png
    type BodySizes = 30 | 48 | 60 | 75 | 100 | 110 | 140 | 150 | 180 | 250 | 352 | 420 | 720 | "30x30" | "48x48" | "60x60" | "75x75" | "100x100" | "110x110" | "140x140" | "150x150" | "150x200" | "180x180" | "250x250" | "352x352" | "420x420" | "720x720";
    type BustSizes = 50 | 60 | 75 | "50x50" | "60x60" | "75x75"
    type HeadshotSizes = 48 | 50 | 60 | 75 | 100 | 110 | 150 | 180 | 352 | 420 | 720 | "48x48" | "50x50" | "60x60" | "75x75" | "100x100" | "110x110" | "150x150" | "180x180" | "352x352" | "420x420" | "720x720";

    interface LoggedInUserData {
        UserID: number,
        UserName: string,
        RobuxBalance: number,
        ThumbnailUrl: string,
        IsAnyBuildersClubMember: false,
        IsPremium: boolean
    }

    interface AuthenticatedUserData {
        id: number;
        name: string;
        displayName: string;
    }

    interface UserLoginApiData {
        userId: number;
    }

    interface AvatarEntry {
        url: string;
        final: boolean;
    }

    interface UserStatus {
        online: boolean;
        lastSeen: Date;
    }

    interface FriendRequestEntry {
        description: string;
        created: Date;
        isBanned: boolean;
        id: number;
        name: string;
        displayName: string;
    }

    interface FriendRequestsPage {
        previousPageCursor?: string;
        nextPageCursor?: string;
        data: FriendRequestEntry[];
    }

    interface FriendEntry {
        created: Date;
        id: number;
        isBanned: boolean;
        isDeleted: boolean;
        isOnline?: boolean;
        name: string;
        description?: string;
        displayName: string;
        externalAppDisplayName?: string;
        friendFrequentRank: number;
        friendFrequentScore: number;
        presenceType?: UserPresenceType;
    }

    interface Friends {
        data: FriendEntry[];
    }

    interface FollowEntry {
        isDeleted: false;
        id: number;
        name: string;
        description: string;
        created: Date;
        displayName: string;
    }

    interface FollowingsPage {
        previousPageCursor?: string;
        nextPageCursor?: string;
        data: FollowEntry[];
    }

    interface FollowersPage {
        previousPageCursor?: string;
        nextPageCursor?: string;
        data: FollowEntry[];
    }

    //

    interface PrivateMessagesPage {
        collection: PrivateMessage[];
        totalPages: number;
        totalCollectionSize: number;
        pageNumber: number;
    }

    //

    interface UserEntry {
        userId: number;
        name: string;
        displayName: string;
    }

    interface UsernameHistoryEntry {
        name: string;
    }

    interface PrivateMessageParent {
        page: number;
    }

    interface PrivateMessage {
        id: number;
        sender: UserEntry;
        recipient: UserEntry;
        subject: string;
        body: string;
        created: Date;
        updated: Date;
        isRead: boolean;
        isSystemMessage: boolean;
        isReportAbuseDisplayed: boolean;
        parent: PrivateMessageParent;
    }

    interface NotificationMessage {
        type: string;
        [key: string]: any;
    }

    type FriendRequest = number;

    interface UserPresence {
        userPresenceType?: UserPresenceType;
        lastLocation?: string;
        placeId?: number;
        rootPlaceId?: number;
        gameId?: string;
        universeId?: number;
        userId?: number;
        lastOnline?: string;
    }

    interface PlayerInfo {
        username: string;
        displayName: string;
        blurb: string;
        joinDate: Date;
        age?: number;
        friendCount?: number;
        followerCount?: number;
        followingCount?: number;
        isBanned: boolean;
    }

    interface UserInfo {
        description: string;
        created: Date;
        isBanned: boolean;
        hasVerifiedBadge: boolean;
        id: number;
        name: string;
        displayName: string;
    }

    interface Presences {
        userPresences: UserPresence[]
    }

    interface PlayerThumbnailData {
        targetId: number;
        state: "Completed" | "Pending" | "Blocked";
        imageUrl?: string;
    }

    interface PromotionChannelsResponse {
        facebook?: string;
        twitter?: string;
        youtube?: string;
        twitch?: string;
        guilded?: string;
    }

    interface UserSearchResult {
        previousUsernames: string[];
        hasVerifiedBadge: boolean;
        id: number;
        name: string;
        displayName: string;
    }

    /// Badges

    interface BadgeAwarder {
        id: number;
        type: string;
    }

    interface UserBadgeStats {
        badgeId: number;
        awardedDate: Date;
    }

    interface BadgeStatistics {
        pastDayAwardedCount: number;
        awardedCount: number;
        winRatePercentage: number;
    }

    interface BadgeUniverse {
        id: number;
        name: string;
        rootPlaceId: number;
    }

    //
    interface PlayerBadges {
        id: number;
        name: string;
        description?: string;
        displayName: string;
        displayDescription?: string;
        enabled: boolean;
        iconImageId: number;
        displayIconImageId: number;
        awarder: BadgeAwarder;
        statistics: BadgeStatistics;
        created: Date;
        updated: Date;
    }
    //

    interface BadgeInfo {
        id: number;
        name: string;
        description?: string;
        displayName: string;
        displayDescription?: string;
        enabled: boolean;
        iconImageId: number;
        displayIconImageId: number;
        created: Date;
        updated: Date;
        statistics: BadgeStatistics
        awardingUniverse: BadgeUniverse
    }

    //Inventory

    interface AssetOwner {
        userId: number;
        username: string;
        buildersClubMembershipType: number;
    }

    interface CollectibleEntry {
        userAssetId: number;
        serialNumber?: number;
        assetId: number;
        name: string;
        recentAveragePrice: number;
        originalPrice?: number;
        assetStock?: number;
        buildersClubMembershipType: number;
    }
    //

    interface InventoryEntry {
        assetId: number;
        name: string;
        assetType: string;
        created: Date;
        updated?: Date;
        assetName?: string;
        userAssetId?: number;
        owner?: AssetOwner;
    }

    ///Trading

    interface UAIDResponse {
        uaids: number[],
        failedIds: number[]
    }

    interface CanTradeResponse {
        canTrade: boolean,
        status: string
    }

    interface TradeUser {
        userId: number;
        username: string;
        displayName: string;
    }

    interface TradeAsset {
        id: number,
        user: TradeUser,
        created: Date,
        expiration?: Date,
        isActive: boolean,
        status: string
    }

    interface DetailedTradeAsset {
        id: number,
        serialNumber: number,
        assetId: number,
        name: string,
        recentAveragePrice: number,
        originalPrice: number,
        assetStock: number,
        membershipType: string
    }

    interface DetailedTradeOffer {
        user: TradeUser,
        userAssets: DetailedTradeAsset[],
        robux: number
    }

    interface TradeOffer {
        userAssetIds: number[],
        robux: number
    }

    interface TradeInfo {
        offers: DetailedTradeOffer[],
        id: number,
        user: TradeUser,
        created: Date,
        expiration?: Date,
        isActive: boolean,
        status: string
    }

    interface SendTradeResponse {
        id: number
    }

    /// Utility

    type SelectorFunction = (selector: string) => { val(): any };
    type SortOrder = 'Asc' | 'Desc';
    type Limit = 10 | 25 | 50 | 100;

    interface Inputs {
        /**
         * With a provided name, this returns the input's value.
         */
        [name: string]: string;
    }

    interface GetVerificationResponse {
        body?: string;
        inputs: Inputs;
        header: string;
    }

    interface HttpOptions {
        verification?: string;
        jar?: CookieJar;
    }

    interface ThreadedPromise extends Promise<void> {
        getStatus(): number;
        getCompleted(): number;
        getExpected(): number;
    }

    interface GetLatestResponse {
        latest: number;
        data: object;
        repeat?: boolean;
    }

    interface Datastore {
        name: string;
        createdTime: Date;
    }

    interface DatastoresResult {
        datastores: Datastore[];
        nextPageCursor?: string;
    }

    interface EntryKey {
        scope: string;
        key: string;
    }

    interface DatastoreKeysResult {
        keys: EntryKey[];
        nextPageCursor?: string;
    }

    interface DatastoreEntry {
        data: any;
        metadata: {
            /**  (ISO datetime, UTC): the time at which the entry was created */
            robloxEntryCreatedTime: Date;
            /**  (ISO datetime, UTC): the time at which the entry was updated */
            lastModified: Date;
            /** version of the entry being read */
            robloxEntryVersion: string;
            robloxEntryAttributes?: string;
            robloxEntryUserIDs?: string;
            /** the base-64 encoded MD5 checksum of the content */
            contentMD5: string;
            /** the content length in bytes */
            contentLength: number;
        }
    }

    interface EntryVersion {
        version: string;
        deleted: boolean;
        contentLength: number;
        createdTime: Date;
        objectCreatedTime: Date;
    }

    interface EntryVersionsResult {
        versions: EntryVersion[];
        nextPageCursor: string;
    }

    // Functions

    /// AccountInformation

    /**
     * 🔐 Get the social link data (promotion channels) associated with a user.
     */
    function getUserSocialLinks(userId: number, jar?: CookieJar): Promise<PromotionChannelsResponse>;

    /// AccountSettings

    /**
     * 🔐 Blocks the user with `userId`.
     */
    function block(userId: number, jar?: CookieJar): Promise<void>;

    /**
     * 🔐 Unblocks the user with `userId`.
     */
    function unblock(userId: number, jar?: CookieJar): Promise<void>;

    /// Asset

    /**
     * 🔐 Deletes an item from the logged in user's inventory
     */
    function deleteFromInventory(assetId: number, jar?: CookieJar): Promise<void>;

    /**
     * ✅ Gets `info` of `gamepass` and caches according to settings.
     */
    function getGamePassProductInfo(gamepass: number): Promise<GamePassProductInfo>;

    /**
     * ✅ Gets `info` of `asset` and caches according to settings.
     */
    function getProductInfo(asset: number): Promise<ProductInfo>;

    /**
     * 🔐 Uploads `data` to `asset` with `itemOptions`. If asset is empty a new asset will be created. The assetId is returned as a number. Note that `itemOptions` is required when creating a new asset. It is only optional when updating an old asset, which ignores `itemOptions` and only updates `data`.
     */
    function uploadAnimation(data: string | stream.Stream, itemOptions?: UploadModelItemOptions, asset?: number, jar?: CookieJar): Promise<number>;

    /**
     * 🔐 Uploads an image stored in `file` as an `assetType` with `name`. If `groupId` is specified it will be uploaded to that group. This is for uploading shirts, pants, or decals which have the assetTypes `11`, `12`, and `13`, respectively. Returns the asset `id` of the new item.
     */
    function uploadItem(name: string, assetType: UploadItemAssetType, file: string | stream.Stream, groupId?: number, jar?: CookieJar): Promise<UploadItemResponse>;

    /**
     * 🔐 Uploads `data` to `asset` with `itemOptions`. If asset is empty a new asset will be created. Both the assetId as well as the assetVersionId are returned in a object. Note that `itemOptions` is required when creating a new asset. It is only optional when updating an old asset, which ignores `itemOptions` and only updates `data`.
     */
    function uploadModel(data: string | stream.Stream, itemOptions?: UploadModelItemOptions, asset?: number, jar?: CookieJar): Promise<UploadModelResponse>;

    /// Avatar

    /**
     * ✅ Get the avatar rules.
     */
    function avatarRules(option?: "playerAvatarTypes" | "scales" | "wearableAssetTypes" | "bodyColorsPalette" | "basicBodyColorsPalette" | "minimumDeltaEBodyColorDifference" | "proportionsAndBodyTypeEnabledForUser" | "defaultClothingAssetLists" | "bundlesEnabledForUser" | "emotesEnabledForUser" | undefined, jar?: CookieJar): Promise<AvatarRules>;

    function avatarRules(option: "playerAvatarTypes", jar?: CookieJar): Promise<string[]>;
    function avatarRules(option: "scales", jar?: CookieJar): Promise<AvatarRulesScales>;
    function avatarRules(option: "wearableAssetTypes", jar?: CookieJar): Promise<WearableAssetType[]>;
    function avatarRules(option: "bodyColorsPalette", jar?: CookieJar): Promise<BodyColorModel[]>;
    function avatarRules(option: "basicBodyColorsPalette", jar?: CookieJar): Promise<BodyColorModel[]>;
    function avatarRules(option: "minimumDeltaEBodyColorDifference", jar?: CookieJar): Promise<number>;
    function avatarRules(option: "proportionsAndBodyTypeEnabledForUser", jar?: CookieJar): Promise<boolean>;
    function avatarRules(option: "defaultClothingAssetLists", jar?: CookieJar): Promise<DefaultClothingAssetLists>;
    function avatarRules(option: "bundlesEnabledForUser", jar?: CookieJar): Promise<boolean>;
    function avatarRules(option: "emotesEnabledForUser", jar?: CookieJar): Promise<boolean>;

    /**
     * ✅ Get the assets a given user is wearing.
     */
    function currentlyWearing(userId: number): Promise<AssetIdList>;

    /**
     * ✅ Get a user's avatar.
     */
    function getAvatar(userId: number): Promise<AvatarInfo>;

    /**
     * 🔐 Get the current avatar of the logged in user.
     */
    function getCurrentAvatar(option?: "scales" | "playerAvatarType" | "bodyColors" | "assets" | "defaultShirtApplied" | "defaultPantsApplied" | undefined, jar?: CookieJar): Promise<AvatarInfo>;

    function getCurrentAvatar(option: "scales", jar?: CookieJar): Promise<AvatarScale>;
    function getCurrentAvatar(option: "playerAvatarType", jar?: CookieJar): Promise<PlayerAvatarType>;
    function getCurrentAvatar(option: "bodyColors", jar?: CookieJar): Promise<AvatarBodyColors>;
    function getCurrentAvatar(option: "assets", jar?: CookieJar): Promise<AvatarAsset[]>;
    function getCurrentAvatar(option: "defaultShirtApplied", jar?: CookieJar): Promise<boolean>;
    function getCurrentAvatar(option: "defaultPantsApplied", jar?: CookieJar): Promise<boolean>;

    /**
     * 🔐 Get assets recently worn by the logged in user.
     */
    function getRecentItems(listType?: RecentItemListType, jar?: CookieJar): Promise<AssetRecentItemsResult>;

    /**
     * ✅ Get the details of an outfit.
     */
    function outfitDetails(outfitId: number): Promise<AvatarOutfitDetails>;

    /**
     * ✅ Get the outfits of a user.
     */
    function outfits(userId: number, page?: number, itemsPerPage?: number): Promise<GetOutfitsResult>;

    /**
     * 🔐 Redraws the avatar of the logged in user.
     */
    function redrawAvatar(jar?: CookieJar): Promise<void>;

    /**
     * 🔐 Removes the asset with `assetId` from the logged in user's avatar.
     */
    function removeAssetId(assetId: number, jar?: CookieJar): Promise<void>;

    /**
     * 🔐 Sets the body colors of the logged in user's avatar.
     */
    function setAvatarBodyColors(args: AvatarBodyColors & { jar?: CookieJar }): Promise<void>;

    /**
     * 🔐 Sets the scales of the logged in user's avatar.
     */
    function setAvatarScales(args: AvatarScale & { jar?: CookieJar }): Promise<void>;

    /**
     * 🔐 Sets the player avatar type of the logged in user's avatar. (R6/R15)
     */
    function setPlayerAvatarType(avatarType: PlayerAvatarType, jar?: CookieJar): Promise<void>;

    /**
     * 🔐 Sets the assets the logged in user is wearing.
     */
    function setWearingAssets(assetIds: number[], jar?: CookieJar): Promise<void>;

    /**
     * 🔐 Wears a specific asset on the logged in user's avatar.
     */
    function wearAssetId(assetId: number, jar?: CookieJar): Promise<void>;

    /// Badges

    /**
     * ✅ Gets user award date for a badge.
     */
    function getAwardedTimestamps(userId: number, badgeId: number[]): Promise<UserBadgeStats>

    /**
     * ✅ Gets information about a badge.
     */
    function getBadgeInfo(badgeId: number): Promise<BadgeInfo>

    /**
     * ✅ Get the badges in a specific game.
     */
    function getGameBadges(universeId: number, limit?: Limit, cursor?: string, sortOrder?: SortOrder): Promise<BadgeInfo>

    /**
     * ✅ Gets the badges of a user.
     */
    function getPlayerBadges(userId: number, limit?: number, sortOrder?: SortOrder): Promise<Array<PlayerBadges>>

    /**
     * 🔐 Updates badge information.
     */
    function updateBadgeInfo(badgeId: number, name?: string, description?: string, enabled?: boolean, jar?: CookieJar): Promise<void>

    /// Chat

    /**
     * 🔐 Adds a user to a group conversation.
     */
    function addUsersToConversation(conversationId: number, userIds: number[], jar?: CookieJar): Promise<ConversationAddResponse>;

    /**
     * 🔐 Get chat settings.
     */
    function chatSettings(jar?: CookieJar): Promise<ChatSettings>;

    /**
     * 🔐 Get the chat messages of a conversation.
     */
    function getChatMessages(conversationId: number, pageSize?: number, exclusiveStartMessageId?: string, jar?: CookieJar): Promise<ChatMessage[]>;

    /**
     * 🔐 Get conversation details for the conversationIds specified in the parameters
     */
    function getConversations(conversationIds: number[], jar?: CookieJar): Promise<ChatConversation[]>;

    /**
     * 🔐 Get the rollout settings for the logged in user.
     */
    function getRolloutSettings(featureNames?: ChatFeatureNames[], jar?: CookieJar): Promise<GetRolloutSettingsResult>;

    /**
     * 🔐 Get the unread conversation count for the logged in user.
     */
    function getUnreadConversationCount(jar?: CookieJar): Promise<GetUnreadConversationCountResult>;

    /**
     * 🔐 Get the unread messages for the logged in user in the conversations specified in the parameters.
     */
    function getUnreadMessages(conversationIds: number[], pageSize?: number, jar?: CookieJar): Promise<ChatConversationWithMessages[]>;

    /**
     * 🔐 Get conversations for the logged in user.
     */
    function getUserConversations(pageNumber?: number, pageSize?: number, jar?: CookieJar): Promise<ChatConversation[]>;

    /**
     * 🔐 Mark a conversation as read.
     */
    function markChatAsRead(conversationId: number, endMessageId: string): Promise<void>;

    /**
     * 🔐 Mark a conversation as seen.
     */
    function markChatAsSeen(conversationIds: number[], jar?: CookieJar): Promise<void>;

    /**
     * 🔐 Get the latest messages for the conversations specified in the parameters.
     */
    function multiGetLatestMessages(conversationIds: number[], pageSize?: number, jar?: CookieJar): Promise<ChatConversationWithMessages[]>;

    /**
     * 🔐 Removes a user from a group conversation.
     */
    function removeFromGroupConversation(conversationId: number, userId: number, jar?: CookieJar): Promise<ConversationRemoveResponse>;

    /**
     * 🔐 Renames a group conversation.
     */
    function renameGroupConversation(conversationId: number, title: string, jar?: CookieJar): Promise<ConversationRenameResponse>;

    /**
     * 🔐 Sends a chat message to a conversation.
     */
    function sendChatMessage(conversationId: number, message: string, jar?: CookieJar): Promise<SendChatResponse>;

    /**
     * 🔐 Sets the typing status of the logged in user in a conversation.
     */
    function setChatUserTyping(conversationId: number, isTyping: boolean, jar?: CookieJar): Promise<UpdateTypingResponse>;

    /**
     * 🔐 Starts a conversation with a user.
     */
    function start121Conversation(userId: number, jar?: CookieJar): Promise<void>;

    /**
     * 🔐 Starts a cloud edit/team create conversation.
     */
    function startCloudEditConversation(placeId: number, jar?: CookieJar): Promise<void>;

    /**
     * 🔐 Starts a group conversation.
     */
    function startGroupConversation(userIds: number[], title: string, jar?: CookieJar): Promise<StartGroupConversationResponse>;

    /// Client
    /**
     * 🔐 Sets the API key for the user to enable use of open cloud functions.
     * This is not the same as a .ROBLOSECURITY cookie.
     */
    function setAPIKey(apiKey: string): Promise<void>

    /**
     * 🔐 Allows the user to login with a provided cookie string, bypassing the username/password captcha issues.
     * By default, the provided cookie will be validated by making a HTTP request. To disable this behaviour, pass false as the second optional parameter (shouldValidate).
     */
    function setCookie<B extends boolean = true>(cookie: string, shouldValidate?: B): B extends false ? boolean : Promise<AuthenticatedUserData>

    /// DataStores

    /**
     * ☁️ Marks the entry as deleted by creating a tombstone version. Entries are deleted permanently after 30 days.
     */
    function deleteDatastoreEntry(universeId: number, datastoreName: string, entryKey: string, scope?: string, jar?: CookieJar): Promise<void>

    /**
     * ☁️ Returns the latest value and metadata associated with an entry, or a specific version if versionId is provided.
     */
    function getDatastoreEntry(universeId: number, datastoreName: string, entryKey: string, scope?: string, versionId?: string, jar?: CookieJar): Promise<DatastoreEntry>

    /**
     * ☁️ Returns a list of entry versions of an entry.
     */
    function getDatastoreEntryVersion(universeId: number, datastoreName: string, entryKey: string, scope?: string | boolean, startTime?: Date, endTime?: Date, sortOrder?: "Ascending" | "Descending", limit?: number, cursor?: string, jar?: CookieJar): Promise<EntryVersionsResult>

    /**
     * ☁️ Returns a list of entry keys within a data store.
     */
    function getDatastoreKeys(universeId: number, datastoreName: string, scope?: string | boolean, prefix?: string, limit?: number, cursor?: string, jar?: CookieJar): Promise<DatastoreKeysResult>

    /**
     * ☁️ Returns a list of data stores belonging to a universe.
     */
    function getDatastores(universeId: number, prefix?: string, limit?: number, string?: string, jar?: CookieJar): Promise<DatastoresResult>

    /**
     * ☁️ Increments the value for an entry by a given amount, or create a new entry with that amount.
     */
    function incrementDatastoreEntry(universeId: number, datastoreName: string, entryKey: string, incrementBy: number, scope?: string, robloxEntryUserIDs?: number[], robloxEntryAttributes?: object, jar?: CookieJar): Promise<DatastoreEntry>

    /**
     * ☁️ Sets the value, metadata and user IDs associated with an entry.
     */
    function setDatastoreEntry(universeId: number, datastoreName: string, entryKey: string, body: any, scope?: string, matchVersion?: string, exclusiveCreate?: boolean, robloxEntryUserIDs?: number[], robloxEntryAttributes?: object, jar?: CookieJar): Promise<EntryVersion>

    /// Develop

    /**
     * ✅ Returns whether the user can manage a given asset.
     */
    function canManage(userId: number, assetId: number): Promise<boolean>;

    /**
     * 🔐 Configures an item (shirt, pants, decal, etc.) with the id `id` to have `name` and `description`. If `enableComments` is true comments will be allowed and if `sellForRobux` is set it will be put on sale for that amount of robux.
     *
     * NOTE: Use `configureGamePass()` for Game Passes.
     */
    function configureItem(id: number, name: string, description: string, enableComments?: boolean, sellForRobux?: boolean, genreSelection?: number, jar?: CookieJar): Promise<ConfigureItemResponse>;

    /**
     * 🔐 Modifies a universe's settings
     */
    function updateUniverse(universeId: number, settings: UniverseSettings, jar?: CookieJar): Promise<UpdateUniverseResponse>;

    /**
     * 🔐 Updates a universe's public access setting
     */
    function updateUniverseAccess(universeId: number, isPublic?: boolean, jar?: CookieJar): Promise<void>;

    /// Economy

    /**
     * 🔓 Gets the amount of Robux in a group.
     */
    function getGroupFunds(group: number): Promise<number>;

    /**
     * 🔐 Gets recent Robux revenue summary for a group; shows pending Robux. | Requires "Spend group funds" permissions.
     */
    function getGroupRevenueSummary(group: number, timeFrame?: "Day" | "Week" | "Month" | "Year"): Promise<RevenueSummaryResponse>;

    /**
     * 🔐 Gets the transaction history of the specified group.
     */
    function getGroupTransactions(group: number, transactionType?: "Sale" | "Purchase" | "AffiliateSale" | "DevEx" | "GroupPayout" | "AdImpressionPayout", limit?: number, sortOrder?: SortOrder, jar?: CookieJar): Promise<TransactionItem[]>;

    /**
     * ✅ Get the recent sale history (price and volume per day for 180 days) of a limited asset.
     */
    function getResaleData(assetId: number): Promise<ResaleDataResponse>;

    /**
     * 🔐 Gets available resale copies of a limited asset.
     */
    function getResellers(assetId: number, limit?: Limit, jar?: CookieJar): Promise<ResellerData[]>;

    /**
     * 🔐 Gets the transaction history of the logged in user or of the user specified by the jar.
     */
    function getUserTransactions(transactionType?: "Sale" | "Purchase" | "AffiliateSale" | "DevEx" | "GroupPayout" | "AdImpressionPayout", limit?: number, sortOrder?: SortOrder, jar?: CookieJar): Promise<TransactionItem[]>;

    /**
     * 🔐 Returns the current user's robux balance
     */
    function getUserFunds(userId?: number, jar?: CookieJar): Promise<number>;

    /// Friends

    /**
     * 🔐 Accepts friend requests from `userId`.
     */
    function acceptFriendRequest(userId: number, jar?: CookieJar): Promise<void>;

    /**
     * 🔐 Declines all friend requests.
     */
    function declineAllFriendRequest(jar?: CookieJar): Promise<void>;

    /**
     * 🔐 Declines friend requests from `userId`.
     */
    function declineFriendRequest(userId: number, jar?: CookieJar): Promise<void>;

    /**
     * ✅ Gets the number of followers a user has.
     */
    function getFollowerCount(userId: number): Promise<number>;

    /**
     * ✅ Get the followers of a user (users who follow the specified person)
     */
    function getFollowers(userId: number, sortOrder?: SortOrder, limit?: Limit, cursor?: string, jar?: CookieJar): Promise<FollowersPage>;

    /**
     * ✅ Gets the number of followings a user has (users who have been followed by the specified person).
     */
    function getFollowingCount(userId: number): Promise<number>;

    /**
     * ✅ Get the followings of a user (users who have been followed by the specified person)
     */
    function getFollowings(userId: number, sortOrder?: SortOrder, limit?: Limit, cursor?: string, jar?: CookieJar): Promise<FollowingsPage>;

    /**
     * ✅ Get the number of friends a user has.
     */
    function getFriendCount(userId: number): Promise<number>;

    /**
     * 🔐 Gets the pending friend requests of the logged in user.
     */
    function getFriendRequests(sortOrder?: SortOrder, limit?: Limit, cursor?: string, jar?: CookieJar): Promise<FriendRequestsPage>;

    /**
     * ✅ Gets the friends list of the specified user.
     */
    function getFriends(userId: number, jar?: CookieJar): Promise<Friends>;

    /**
     * 🔐 Removes friendship with `userId`.
     */
    function removeFriend(userId: number, jar?: CookieJar): Promise<void>;

    /**
     * 🔐 Sends a friend request to `userId`.
     */
    function sendFriendRequest(userId: number, jar?: CookieJar): Promise<void>;

    /**
     * 🔐 Unfollows the user with `userId`.
     */
    function unfollow(userId: number, jar?: CookieJar): Promise<void>;

    /// Games

    /**
     * 🔐 Adds a developer product to the specified universe.
     * Warning: The `productId` returned by this function does not match the `productId` used by other endpoints.
     */
    function addDeveloperProduct(universeId: number, name: string, priceInRobux: number, description?: string, jar?: CookieJar): Promise<DeveloperProductAddResult>;

    /**
     * 🔐 Configures a game pass with the id `gamePassId` to have a `name`, `description`, `price` in Robux, and `icon` image. If `name` is an empty string, only `price` is changed. Setting `price` to false, 0, or a negative value will place the game pass off-sale.
     * Returns a `GamePassResponse` with the changed attributes.
     *
     * NOTE: Updating `name` will affect `description`: you must repeat `description` with each `name` update, or `description` will be cleared.
     */
    function configureGamePass(gamePassId: number, name: string, description?: string, price?: number | boolean, icon?: string | stream.Stream, jar?: CookieJar): Promise<GamePassResponse>;

    /**
     * 🔐 Returns the existing developer products in a specified game.
     */
    function getDeveloperProducts(placeId: number, page: number, jar?: CookieJar): Promise<DeveloperProductsResult>;

    /**
     * 🔐 Returns data about the existing game instances (servers) of the specified place. You must have permission to view the game's server list to use this. (Must be logged in)
     */
    function getGameInstances(placeId: number, serverType?: "Public" | "Friend" | "VIP", sortOrder?: SortOrder, limit?: number): Promise<GameInstance[]>;

    /**
     * ✅ Gets a game's game passes.
     */
    function getGamePasses(universeId: number, limit?: Limit): Promise<GamePassData[]>

    /**
     * 🔐 Get the social link data associated with a game.
     */
    function getGameSocialLinks(universeId: number, jar?: CookieJar): Promise<SocialLinkResponse[]>;

    /**
     * ✅ Gets a list of games from the specified group.
     */
    function getGroupGames(groupId: number, accessFilter?: "All" | "Public" | "Private", sortOrder?: SortOrder, limit?: Limit, cursor?: string): Promise<GroupGameInfo[]>;

    /**
     * 🔓 Returns information about the universe(s) in question, such as description, name etc; varies based on whether or not you're logged in.
     */
    function getUniverseInfo(universeIds: number[] | number, jar?: CookieJar): Promise<UniverseInformation[]>;

    /**
    * ☁️ Publish a message to a subscribed topic.
    */
    function publishToTopic(universeId: number, topic: string, data: (Object | string), jar?: CookieJar): Promise<boolean>;

    /**
     * 🔐 Returns information about the place(s) in question, such as name, description, etc.
     */
    function getPlaceInfo(placeIds: number[] | number, jar?: CookieJar): Promise<PlaceInformation[]>;

    /**
     * 🔐 Update a developer product.
     */
    function updateDeveloperProduct(universeId: number, productId: number, priceInRobux: number, name?: string, description?: string, jar?: CookieJar): Promise<void>;

    /// Groups
    /**
     * 🔐 Moves the user with userId `target` up or down the list of ranks in `group` by `change`. For example `changeRank(group, target, 1)` would promote the user 1 rank and `changeRank(group, target, -1)` would demote them down 1. Note that this simply follows the list, ignoring ambiguous ranks. The full `newRole` as well as the user's original `oldRole` is returned.
     */
    function changeRank(group: number, target: number, change: number, jar?: CookieJar): Promise<ChangeRankResult>;

    /**
     * 🔐 Deletes the wall post with `id` in `group`. If `page` is known it can be inserted to speed up finding the post, otherwise it will search for the post. Alternatively `post` can be passed in, which only has to contain `view` and `parent.index` to work properly. Using `post` will be much faster because it will not have to search for the post first.
     */
    function deleteWallPost(group: number, post: number | WallPost, page?: number, jar?: CookieJar): Promise<void>;

    /**
     * 🔐 Deletes all wall posts sent by the provided user id.
     */
    function deleteWallPostsByUser(group: number, userId: number, jar?: CookieJar): Promise<void>;

    /**
     * 🔐 Alias of `changeRank(group, target, -1)`.
     */
    function demote(group: number, target: number, jar?: CookieJar): Promise<ChangeRankResult>;

    /**
     * 🔐 Exiles user with `userId` target from `group`.
     */
    function exile(group: number, target: number, jar?: CookieJar): Promise<void>;

    /**
     * 🔐 Gets the audit logs of the specified group.
     */
    function getAuditLog(group: number, actionType?: "" | "DeletePost" | "RemoveMember" | "AcceptJoinRequest" | "DeclineJoinRequest" | "PostStatus" | "ChangeRank" | "BuyAd" | "SendAllyRequest" | "CreateEnemy" | "AcceptAllyRequest" | "DeclineAllyRequest" | "DeleteAlly" | "DeleteEnemy" | "AddGroupPlace" | "RemoveGroupPlace" | "CreateItems" | "ConfigureItems" | "SpendGroupFunds" | "ChangeOwner" | "Delete" | "AdjustCurrencyAmounts" | "Abandon" | "Claim" | "Rename" | "ChangeDescription" | "InviteToClan" | "KickFromClan" | "CancelClanInvite" | "BuyClan" | "CreateGroupAsset" | "UpdateGroupAsset" | "ConfigureGroupAsset" | "RevertGroupAsset" | "CreateGroupDeveloperProduct" | "ConfigureGroupGame" | "Lock" | "Unlock" | "CreateGamePass" | "CreateBadge" | "ConfigureBadge" | "SavePlace" | "PublishPlace", userId?: number, sortOrder?: SortOrder, limit?: Limit, cursor?: string, jar?: CookieJar): Promise<AuditPage>;

    /**
     * ✅ Gets a brief overview of the specified group.
     */
    function getGroup(groupId: number): Promise<Group>;

    /**
     * ✅ Gets the groups a player is in.
     */
    function getGroups(userId: number): Promise<IGroupPartial[]>

    /**
     * 🔐 Get the social link data associated with a group.
     */
    function getGroupSocialLinks(groupId: number, jar?: CookieJar): Promise<SocialLinkResponse[]>;

    /**
     * 🔐 Gets a specific group join request, if it exists.
     */
    function getJoinRequest(group: number, userId: number, jar?: CookieJar): Promise<GroupJoinRequest>;

    /**
     * 🔐 Gets the first page of join requests from `group`.
     */
    function getJoinRequests(group: number, sortOrder?: SortOrder, limit?: Limit, cursor?: string, jar?: CookieJar): Promise<GroupJoinRequestsPage>;

    /**
     * ✅ Gets all (or up to limit when provided and greater than 0) players in `group` with the number/array of `roleset`.
     */
    function getPlayers(group: number, rolesetId: number[] | number, sortOrder?: SortOrder, limit?: number, jar?: CookieJar): Promise<GroupUser[]>;

    /**
         * ✅ Gets `rank` of user with `userId` in `group` and caches according to settings.
         */
    function getRankInGroup(group: number, userId: number): Promise<number>;

    /**
     * ✅ Gets the rank `name` of user with `userId` in `group` and caches according to settings.
     */
    function getRankNameInGroup(group: number, userId: number): Promise<string>;

    /**
     * ✅ Returns role information of rank `rank`, which can be a single rank or an array of ranks. The `roles` object can be passed in directly from the `getRoles` function or the `group` id can be given to retrieve it automatically. If an array of ranks is inputted a parallel array of roles is returned. Alternatively, the name `name` of the role can be searched for, this should be used if there are "ambiguous roles" that have the same rank. If ambiguous roles cannot be resolved an error will be thrown. The actual roleset `id` may be used as well.
     */
    function getRole(group: number | Role[], roleQuery: number | string): Promise<Role>;

    /**
     * 🔐 Returns the permissions a role has been assigned.
     */
    function getRolePermissions(group: number, rolesetId: number, jar?: CookieJar): Promise<RolePermissions>;

    /**
     * ✅ Returns role information of a group with groupId `group` in the form `[{"ID":number,"Name":"string","Rank":number},{"ID":number,"Name":"string","Rank":number}]`.
     */
    function getRoles(group: number): Promise<Role[]>;

    /**
     * 🔓 Gets the current shout in `group`. If there is no shout the promise is fulfilled but nothing is returned.
     */
    function getShout(group: number, jar?: CookieJar): Promise<GroupShout>;

    /**
     * 🔓 Gets posts on the `group` wall. Parameter `page` may be a number or array where negative numbers indicate trailing pages, if it is not specified all pages of the wall will be retrieved.
     * The body of the post is in `content` and the `id` and `name` of the poster are stored in the `author` object. The `id` is the unique ID of the wall post that is internally used by ROBLOX. This serves no real use other than reporting it (although it can be used indirectly to track down specific posts).
     * The `page` the post was found on and its `index` on that page are both in the `parent` object.
     * If `view` is true the viewstates of each page will be returned in the `views` object, with each page having its viewstates at the corresponding page number. For example page 5 of the wall will have its view stored in `wall.views[5]`.
     * The `getStatus` function is returned as a property of the promise and returns the percent completion of the operation.
     */
    function getWall(group: number, sortOrder?: SortOrder, limit?: Limit, cursor?: string, jar?: CookieJar): Promise<WallPostPage>;

    /**
     * 🔐 Performs a payout in group with the groupId `group`. If `recurring` is true this will configure the recurring options for the group's payout replacing all old values, otherwise a one-time-payout is made. To clear the recurring payouts, pass in empty arrays to both member and amount. Argument `member` can either be a single userId or an array of userIds. If it is a single value `amount` must be as well, otherwise `amount` has to be a parallel array of equal length. If `usePercentage` is true `amount` percentage of the total group funds is paid to the members, otherwise it pays `amount` ROBUX. Note that recurring payouts are always percentages, and when `recurring` is true `usePercentage` is ignored.
     */
    function groupPayout(group: number, member: number | number[], amount: number | number[], recurring?: boolean, usePercentage?: boolean, jar?: CookieJar): Promise<void>;

    /**
     * 🔐 Accepts user with `username` into `group`. Note that `username` is case-sensitive.
     */
    function handleJoinRequest(group: number, userId: number, accept: boolean, jar?: CookieJar): Promise<void>;

    /**
     * 🔐 Leaves the group with id `group`. Unless `useCache` is enabled the function will not cache because errors will occur if joining or leaving the same group multiple times, you can enable it if you are only joining or leaving a group once or many differenct groups once.
     */
    function leaveGroup(group: number, jar?: CookieJar): Promise<void>;

    /**
     * 🔐 Alias of `changeRank(group, target, 1)`.
     */
    function promote(group: number, target: number, jar?: CookieJar): Promise<ChangeRankResult>;

    /**
     * ✅ Returns the groups matching a given search term.
     */
    function searchGroups(keyword: string, prioritizeExactMatch?: boolean, limit?: number): Promise<GroupSearchItem[]>;

    /**
     * 🔐 Sets the group description for group with id `group` to `description`.
     */
    function setGroupDescription(group: number, description: string, jar?: CookieJar): Promise<GroupDescriptionResult>;

    /**
     * 🔐 Sets the group name for group with id `group` to `name`.
     */
    function setGroupName(group: number, name: string, jar?: CookieJar): Promise<GroupNameResult>;

    /**
     * 🔐 Changes the rank of the player with the `target` userId in group with `groupId` to the provided rank. If rank <= 255, it is assumes to be rank. If rank is a string, it is assumed to be the name of a rank/role. If rank is > 255, it is assumed to be a rolesetId (which speeds up requests). If two or more ranks share a rank, this will not resolve properly (use the name of the rank instead). You may also pass a Role which can be gotten from `getRoles` or `getRole`.
     */
    function setRank(group: number, target: number, rank: number | string | Role, jar?: CookieJar): Promise<Role>;

    /**
     * 🔐 Changes the rank of the player with the `target` userId in group with `groupId` to the provided rank. If rank <= 255, it is assumes to be rank. If rank is a string, it is assumed to be the name of a rank/role. If rank is > 255, it is assumed to be a rolesetId (which speeds up requests). If two or more ranks share a rank, this will not resolve properly (use the name of the rank instead). You may also pass a Role which can be gotten from `getRoles` or `getRole`.
     */
    function setRoleInfo(group: number, role: number | string | Role, newRoleInfo: Role, jar?: CookieJar): Promise<Role>;

    /**
     * 🔐 Shouts message `message` in the group with groupId `group`. Setting `message` to "" will clear the shout.
     */
    function shout(group: number, message: string, jar?: CookieJar): Promise<GroupShout>;

    /// Inventory

    /**
     * 🔐 Get the collectibles of a user.
     */
    function getCollectibles(userId: number, assetType?: string, sortOrder?: SortOrder, limit?: number, jar?: CookieJar): Promise<CollectibleEntry[]>;

    /**
     * 🔓 Get the inventory of a user.
     */
    function getInventory(userId: number, assetTypes: Array<string>, sortOrder?: SortOrder, limit?: number, jar?: CookieJar): Promise<InventoryEntry[]>;

    /**
     * 🔓 Get the inventory of a user by the assetTypeId.
     */
    function getInventoryById(userId: number, assetTypeId: number, sortOrder?: SortOrder, limit?: number, jar?: CookieJar): Promise<InventoryEntry[]>;

    /**
     * ✅ Returns whether a user owns an asset or not
     */
    function getOwnership(userId: number, itemTargetId: number, itemType?: "Asset" | "GamePass" | "Badge" | "Bundle"): Promise<boolean>;

    /**
     * 🔓 Get the UserAssetIDs for assets a user owns.
     */
    function getUAIDs(userId: number, assetIds: number[], exclusionList?: number[], jar?: CookieJar): Promise<UAIDResponse>;

    /// ItemConfiguration
    /**
     * ✅ Gets a list of assets from the specified group.
     */
    function getGroupAssets(groupId: number, assetType: string, sortOrder?: SortOrder, limit?: Limit, cursor?: string, jar?: CookieJar): Promise<GroupAssetInfo[]>;

    /// PremiumFeatures
    /**
     * 🔐 Gets whether or not a user has premium.
     */
    function getPremium(userId: number, jar?: CookieJar): Promise<boolean>;

    /// Presence
    /**
     * 🔐 Gets the presence statuses of the specified users
     */
    function getPresences(userIds: number[]): Promise<Presences>;

    /// PrivateMessages

    /**
     * 🔐 Gets the messages of the logged in user or of the user specified by the jar. Returns by newest to oldest messages.
     */
    function getMessages(pageNumber?: number, pageSize?: number, messageTab?: "Archive" | "Inbox" | "Sent", jar?: CookieJar): Promise<PrivateMessagesPage>;

    /**
     * 🔐 Sends a message with `body` and `subject` to the user with id `recipient`.
     */
    function message(recipient: number, subject: string, body: string, replyMessageId?: number, includePreviousMessage?: boolean, jar?: CookieJar): Promise<void>;

    /// Thumbnails

    /**
     * ✅ Gets the logo of the specified group.
     */
    function getLogo(groupId: number, size?: GroupIconSize, circular?: boolean, format?: GroupIconFormat): Promise<string>;

    /**
     * ✅ Gets the thumbnail of an array of users.
     */
    function getPlayerThumbnail(userIds: number | number[], size: BodySizes | BustSizes | HeadshotSizes, format?: "png" | "jpeg", isCircular?: boolean, cropType?: "body" | "bust" | "headshot"): Promise<PlayerThumbnailData[]>;

    /**
     * ✅ Gets the thumbnail of asset/users.
     */
    function getThumbnails(thumbnailRequests: ThumbnailRequest[]): Promise<ThumbnailData[]>;

    /// Trades

    /**
     * 🔐 Accept an active trade.
     */
    function acceptTrade(tradeId: number, jar?: CookieJar): Promise<void>;

    /**
     * 🔐 Check if the current user can trade with another user.
     */
    function canTradeWith(userId: number, jar?: CookieJar): Promise<CanTradeResponse>;

    /**
     * 🔐 Counter an active incoming trade..
     */
    function counterTrade(tradeId: number, targetUserId: number, sendingOffer: TradeOffer, receivingOffer: TradeOffer, jar?: CookieJar): Promise<SendTradeResponse>;

    /**
     * 🔐 Decline an active trade.
     */
    function declineTrade(tradeId: number, jar?: CookieJar): Promise<void>;

    /**
     * 🔐 Get detailed info about a trade.
     */
    function getTradeInfo(tradeId: number, jar?: CookieJar): Promise<TradeInfo>;

    /**
     * 🔐 Get all trades under a category.
     */
    function getTrades(tradeStatusType: string, sortOrder?: SortOrder, limit?: number, jar?: CookieJar): Promise<TradeAsset[]>;

    /**
     * 🔐 Send a trade to a user.
     */
    function sendTrade(targetUserId: number, sendingOffer: TradeOffer, receivingOffer: TradeOffer, jar?: CookieJar): Promise<SendTradeResponse>;

    /// Users

    /**
     * ✅ Gets the `blurb` of the user with the ID `userId`.
     */
    function getBlurb(userId: number): Promise<string>;

    /**
     * ✅ Gets the `id` of user with `username` and caches according to settings.
     * Username is not case-sensitive.
     */
    function getIdFromUsername<T extends string | string[]>(username: T): T extends string ? Promise<number> : Promise<number[]>;

    /**
     * ✅ Gets a brief overview of a user.
     */
    function getPlayerInfo(userId: number): Promise<PlayerInfo>;

    /**
     * ✅ Gets basic user information.
     */
    function getUserInfo(userId: number): Promise<UserInfo>;

    /**
     * ✅ Gets `username` of user with `id` and caches according to settings.
     */
    function getUsernameFromId(id: number): Promise<string>;

    /**
     * ✅ Gets a list of usernames the specified user has used.
     */
    function getUsernameHistory(userId: number, limit?: Limit, sortOrder?: SortOrder, cursor?: string): Promise<UsernameHistoryEntry[]>;

    /**
     * ✅ Gets user search results for a keyword.
     */
    function searchUsers(keyword: string, limit: number, cursor: string, jar?: CookieJar): Promise<UserSearchResult[]>;

    /// Utility

    /**
     * 🔐 Removes the `.ROBLOSECURITY` cookie from `jar`. Note that this does not return a new jar, it simply changes the existing one.
     */
    function clearSession(jar: CookieJar): Promise<string>;

    /**
     * 🔐 Gets the verification inputs from `url` and sends a post request with data from `events`, returning the original body before the post request according to `getBody` and obeying the cache based on `ignoreCache`. Use `http` for custom request options for the post request; if url is contained, it will not replace the main url but the url used for getting verification tokens. This function is used for primitive site functions that involve ASP viewstates.
     */
    function generalRequest(url: string, events: object, http?: object, ignoreCache?: boolean, getBody?: boolean, jar?: CookieJar): Promise<Object>;

    /**
     * ✅ Gets the action row for audit log text. Current supported types are: change rank, delete post, and change group status (shouts).
     */
    function getAction(row: string): AuditItem;

    /**
     * 🔐 Get the current authenticated user.
     */
    function getAuthenticatedUser(jar?: CookieJar): Promise<AuthenticatedUserData>
    
    /**
     * 🔐 Gets the current user logged into `jar` and returns an `option` if specified or all options if not.
     */
    function getCurrentUser(option?: "UserID" | "UserName" | "RobuxBalance" | "ThumbnailUrl" | "IsAnyBuildersClubMember" | "IsPremium" | undefined, jar?: CookieJar): Promise<LoggedInUserData>;

    /**
     * 🔐 Gets the current user logged into `jar` and returns an `option` if specified or all options if not.
     */
    function getCurrentUser(option: "UserID", jar?: CookieJar): Promise<number>;

    /**
     * 🔐 Gets the current user logged into `jar` and returns an `option` if specified or all options if not.
     */
    function getCurrentUser(option: "UserName", jar?: CookieJar): Promise<string>;

    /**
     * 🔐 Gets the current user logged into `jar` and returns an `option` if specified or all options if not.
     */
    function getCurrentUser(option: "RobuxBalance", jar?: CookieJar): Promise<number>;

    /**
     * 🔐 Gets the current user logged into `jar` and returns an `option` if specified or all options if not.
     */
    function getCurrentUser(option: "ThumbnailUrl", jar?: CookieJar): Promise<string>;

    /**
     * 🔐 Gets the current user logged into `jar` and returns an `option` if specified or all options if not.
     */
    function getCurrentUser(option: "IsAnyBuildersClubMember", jar?: CookieJar): Promise<boolean>;

    /**
     * 🔐 Gets the current user logged into `jar` and returns an `option` if specified or all options if not.
     */
    function getCurrentUser(option: "IsPremium", jar?: CookieJar): Promise<boolean>;

    /**
     * ✅ Gets the date for `time` which originates from a two-letter `timezone`. This is used to get the time for that timezone despite daylight savings. For example if you did `getDate(time, 'CT')` it would return the time in CST if daylight savings is inactive or CDT if it is active.
     */
    function getDate(time: string, timezone: string): Date;

    /**
     * 🔐 Gets a general X-CSRF-TOKEN for APIs that don't return it after failure. This uses the https://auth.roblox.com/v2/logout API to get tokens.
     */
    function getGeneralToken(jar?: CookieJar): Promise<string>;

    /**
     * 🔐 Generates a unique hash for the given jar file `jar` or default if none is specified. Typically used to cache items that depend on session.
     */
    function getHash(jar?: CookieJar): string;

    /**
     * ✅ Returns verification inputs on the page with the names in `find` - or all inputs if not provided. Typically used for ROBLOX requests working with ASP.NET.
     */
    function getInputs(html: string, find?: Array<any>): Inputs;

    /**
     * ✅ Returns the results from indexing the requested pages.
     */
    function getPageResults(url: string, query: string, sortOrder?: string): Array<any>;

    /**
     * 🔐 Gets the user ID of the current logged in user and caches it permanently. This is needed for some functions.
     */
    function getSenderUserId(jar?: CookieJar): Promise<number>;

    /**
     * 🔐 Gets the `.ROBLOSECURITY` session cookie from `jar`, which is the default jar file if not specified.
     */
    function getSession(jar?: CookieJar): Promise<string>;

    /**
     * 🔐 Gets verification inputs off of `url` using `jar` and caches them. If `getBody` is true, the body and inputs will both be returned in an object. The `header` is the value of the `__RequestVerificationToken` cookie if it exists. If `ignoreCache` is enabled, the resulting tokens will not be cached.
     */
    function getVerification(url: string, ignoreCache?: boolean, getBody?: boolean, jar?: CookieJar): Promise<GetVerificationResponse>;

    /**
     * ✅ Gets verification inputs from `html`. Short for `getInputs(html,['__VIEWSTATE','__VIEWSTATEGENERATOR','__EVENTVALIDATION, '__RequestVerificationToken']')`. Typically used for ROBLOX requests working with ASP.NET. If you have already loaded html with a parser you can pass the `selector` directly.
     */
    function getVerificationInputs(html: string | SelectorFunction): Inputs;

    /**
     * ✅ Sends an http request to `url` with `options`. If `ignoreLoginError` is true the function will not error when the user is redirected to the ROBLOX login page, otherwise it will as detection for failed logins and preventing further errors. The custom option `verification` adds the token to the cookies as `__RequestVerificationToken`. *Note that if jar is a key in the options object but is still null, the default jar will be used*
     */
    function http(url: string, options?: HttpOptions, ignoreLoginError?: boolean): Promise<string>;

    /**
     * ✅ Creates a jar file based on `sessionOnly`. Normally you will not need this argument as the function will use the default from settings.json. If for some other reason you need a jar file you can collect it this way, but without changing the settings it will not work.
     */
    function jar(sessionOnly?: boolean): CookieJar;

    /**
     * 🔐 Refreshes the internally stored cookie, or the cookie provided, stores the new cookie and returns it.
     */
    function refreshCookie(cookie?: string): Promise<string>;

    /**
     * ✅ This is the base for events that do not rely on true streams. The `getLatest` function receives some value that represents the latest version of something (eg. a date or unique ID) and determines if there is new information, every time it is fired it waits `delay` ms before being fired again. Every time it must return an object with the field `latest`, representing the latest value (which will not change if new information was not received), and an array `data` which has the new values (if there are multiple they each have their own index, if there is only one then it is by itself in the array). If `latest` is equal to -2, the returned data will be processed even if it is the initial run (which usually only establishes the latest value). If the return object has a true `repeat` value, the function latest will be run again immediately after. If `delay` is a string it will take the number from that string key in the `event` object of the settings.json file.
     * When the function is first called it will initialize `getLatest` with the value -1 and then emit the `connect` event. Whenever data is received, it will emit the `data` event for each value. If the `close` event is emitted the function will no longer run. If an error occurs the `error` event will be emitted, the function will log a retry and after the number of max retries as specified by settings, it will emit the `close` event.
     * The `getLatest` function will be marked as failed if it does not resolve within `timeout` ms (which can be disabled if timeout is negative). If getLatest fails for any reason (including timeout) it will be retried `maxRetries` times before stopping.
     */
    function shortPoll(getLatest: (latest: number, event: events.EventEmitter) => Promise<GetLatestResponse>, delay: string | number, timeout?: number): events.EventEmitter;

    /**
     * Will run `getPage` (which should return a promise) for every number starting from `start` and ending at `end - 1`. At any one time only `maxThreads` number will be running. This for functions that require a large number of requests but actually makes it practical to use them because it doesn't prepare all the requests at once, taking up all available memory.
     * Errors will not stop the thread from running, instead the request will be tried 3 times after with 5 seconds between each retry. If it still does not succeed it will be skipped and a warning will be printed but will still not end threaded.
     * Returns a promise with the additional function properties `getStatus`, `getCompleted`, `getExpected` which represent the percent completion, the current number of completed threads, and the total number of threads for completion.
     */
    function threaded(getPage: (pageNum: number) => Promise<void> | void, start: number, end: number): ThreadedPromise;


    /**
     * ✅ Updates library options. This allows you to modify settings such as time-out, or number of event retries without
     * altering the settings.json file. Objects passed to this function should match the format of the settings.json file.
     * Unknown keys, or malformed options will be rejected with an error.
     * resilient in that it will reject unknown values, or values which are nested incorrectly - meaning they are ineffective.
     * @param newOptions - The new options to set, structured as per settings.json
     * @see https://github.com/noblox/noblox.js/blob/master/settings.json
     */
    function setOptions(newOptions: Partial<NobloxOptions>): void

    // Events

    /// Asset

    /// Avatar

    /// Chat

    interface OnNewConversationEventEmitter extends events.EventEmitter {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (conversationId: number) => void): this;
    }

    interface OnNewMessageEventEmitter extends events.EventEmitter {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (conversationId: number) => void): this;
    }

    interface OnNewMessageBySelfEventEmitter extends events.EventEmitter {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (conversationId: number) => void): this;
    }

    interface OnUserOnlineEventEmitter extends events.EventEmitter {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (userId: number) => void): this;
    }

    interface OnUserTypingEventEmitter extends events.EventEmitter {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (typingEvent: OnUserTypingChatEvent) => void): this;
    }

    /// Game

    /// Group

    interface OnJoinRequestHandleEventEmitter extends events.EventEmitter {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (joinRequest: GroupJoinRequest) => void): this;

        emit(event: 'handle', joinRequest: GroupJoinRequest, accept: boolean, callback?: () => void): boolean;
    }

    interface OnJoinRequestEventEmitter extends events.EventEmitter {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (joinRequest: GroupJoinRequest) => void): this;
    }

    interface OnShoutEventEmitter extends events.EventEmitter {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (shout: GroupShout) => void): this;
    }

    interface OnAuditLogEventEmitter extends events.EventEmitter {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (auditLog: AuditItem) => void): this;
    }

    interface OnTransactionEventEmitter extends events.EventEmitter {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (transaction: TransactionItem) => void): this;
    }

    /// Party

    interface OnPartyNotificationEventEmitter extends events.EventEmitter {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (partyInfo: PartyData) => void): this;
    }

    /// User

    interface OnFriendRequestEventEmitter extends events.EventEmitter {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (message: FriendRequest) => void): this;
    }

    interface OnMessageEventEmitter extends events.EventEmitter {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (message: PrivateMessage) => void): this;
    }

    interface OnNotificationEventEmitter extends events.EventEmitter {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (name: string, message: NotificationMessage) => void): this;
    }

    interface OnWallPostEventEmitter extends events.EventEmitter {
        on(event: 'connect', listener: () => void): this;
        on(event: 'close', listener: (err: any) => void): this;
        on(event: 'error', listener: (err: Error) => void): this;
        on(event: 'data', listener: (message: WallPost) => void): this;
    }

    // Event Emitter Accessors

    /// Asset

    /// Avatar

    /// Chat

    function onNewConversation(jar?: CookieJar): OnNewConversationEventEmitter;

    function onNewMessage(jar?: CookieJar): OnNewMessageEventEmitter;

    function onNewMessageBySelf(jar?: CookieJar): OnNewMessageBySelfEventEmitter;

    function onUserOnline(jar?: CookieJar): OnUserOnlineEventEmitter;

    function onUserTyping(jar?: CookieJar): OnUserTypingChatEvent;

    /// Game

    /// Group

    /**
     * 🔐 This function emits all join requests and waits until all of them have been resolved by firing the `handle` event with the request and either true or false. You can also pass a third argument `callback` to handle to execute once the join request has been handled. Once all requests on a page have been resolved, the next page is collected. Make sure that all join requests are handled in some way. Because this function has to wait for input, it does handle timeouts but does them within the function as opposed to within shortPoll.
     *
     * To accept all new users that aren't on a blacklist and send them a message, for example:
     * ```javascript
     * const blacklist = [1, 261]
     * const evt = noblox.onJoinRequestHandle(18)
     * evt.on('data', function (request) {
     *   noblox.getIdFromUsername(request.username).then(function (id) {
     *     for (const i = 0; i < blacklist.length; i++) {
     *       if (blacklist[i] === id) {
     *         evt.emit('handle', request, false);
     *         return;
     *       }
     *     }
     *     evt.emit('handle', request, true, function () {
     *       noblox.message(id, 'Welcome', 'Welcome to my group');
     *     });
     *   });
     * });
     * ```
     */
    function onJoinRequestHandle(group: number, jar?: CookieJar): OnJoinRequestHandleEventEmitter;

    function onJoinRequest(group: number, jar?: CookieJar): OnJoinRequestEventEmitter;

    /**
     * 🔓 Fires when there is a shout in the group with groupId `group`. If the shout was cleared the shout body will be blank.
     */
    function onShout(group: number, jar?: CookieJar): OnShoutEventEmitter;

    function onAuditLog(group: number, jar?: CookieJar): OnAuditLogEventEmitter;

    /**
     * 🔓 Fires when there is a new wall post in the group with groupId `group`. If `view` is enabled the wall posts viewstate will be returned in `view`, otherwise it will not be present.
     */
    function onWallPost(group: number, view?: boolean, jar?: CookieJar): OnWallPostEventEmitter;

    /**
     * 🔓 Fires when there is a transaction in the group with groupId `group`, of the given type. Only runs every 60 sec.
     */
    function onGroupTransaction(group: number, transactionType?: "Sale" | "Purchase" | "AffiliateSale" | "DevEx" | "GroupPayout" | "AdImpressionPayout", jar?: CookieJar): OnTransactionEventEmitter;

    /// Party

    // Seems like Party specific events are no longer supported.
    // Still adding them as a function you can use.

    function onPartyDeleted(jar?: CookieJar): OnPartyNotificationEventEmitter;

    function onPartyInvite(jar?: CookieJar): OnPartyNotificationEventEmitter;

    function onPartyJoinedGame(jar?: CookieJar): OnPartyNotificationEventEmitter;

    function onPartyLeftGame(jar?: CookieJar): OnPartyNotificationEventEmitter;

    function onPartySelfJoined(jar?: CookieJar): OnPartyNotificationEventEmitter;

    function onPartySelfLeft(jar?: CookieJar): OnPartyNotificationEventEmitter;

    function onPartyUserJoined(jar?: CookieJar): OnPartyNotificationEventEmitter;

    function onPartyUserLeft(jar?: CookieJar): OnPartyNotificationEventEmitter;

    /// User

    /**
     * 🔐 Fires when new friend requests are received.
     */
    function onFriendRequest(jar?: CookieJar): OnFriendRequestEventEmitter;

    /**
     * 🔐 Fires whenever a new message is received. Because it relies on `onNotification`, the logged in user's notification stream for messages must be enabled; however, it is one of the true events and does not rely on short polling.
     */
    function onMessage(jar?: CookieJar): OnMessageEventEmitter;



    /// Data Stores

}
