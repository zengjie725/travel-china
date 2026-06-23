-- ================================================
-- 全国景点平台 UGC 数据补充功能 数据库表结构设计
-- ================================================

-- 用户表
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,           -- UUID
    username VARCHAR(50) UNIQUE NOT NULL, -- 用户名
    email VARCHAR(100) UNIQUE NOT NULL,   -- 邮箱
    phone VARCHAR(20),                     -- 手机号
    avatar VARCHAR(255),                   -- 头像URL
    password_hash VARCHAR(255) NOT NULL,   -- 密码哈希
    role ENUM('user', 'admin', 'moderator') DEFAULT 'user',  -- 角色
    points INT DEFAULT 0,                  -- 积分
    level VARCHAR(20) DEFAULT '新手',      -- 用户等级
    badges JSON,                           -- 徽章列表
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    status ENUM('active', 'banned', 'inactive') DEFAULT 'active'
);

-- 用户徽章表
CREATE TABLE badges (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,     -- 徽章代码
    name VARCHAR(100) NOT NULL,            -- 徽章名称
    icon VARCHAR(255),                     -- 徽章图标
    description TEXT,                      -- 徽章描述
    points_required INT DEFAULT 0,         -- 所需积分
    criteria JSON,                         -- 获得条件
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户积分记录表
CREATE TABLE points_history (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    action VARCHAR(50) NOT NULL,           -- 动作类型
    points INT NOT NULL,                  -- 积分变化（正/负）
    description TEXT,                      -- 说明
    related_id VARCHAR(36),                -- 关联ID（如景点ID、打卡ID）
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 省份表
CREATE TABLE provinces (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,            -- 省份全称
    short_name VARCHAR(20),               -- 简称
    capital VARCHAR(100),                 -- 省会
    code VARCHAR(10),                     -- 省份代码
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 城市表
CREATE TABLE cities (
    id VARCHAR(36) PRIMARY KEY,
    province_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,           -- 城市名称
    type VARCHAR(20) DEFAULT '地级市',     -- 城市类型
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (province_id) REFERENCES provinces(id)
);

-- 景点表（主库）
CREATE TABLE spots (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,           -- 景点名称
    province_id VARCHAR(36) NOT NULL,
    city_id VARCHAR(36) NOT NULL,
    district VARCHAR(100),                -- 区县
    address VARCHAR(500),                 -- 详细地址
    location_lat DECIMAL(10, 7),           -- 纬度
    location_lng DECIMAL(10, 7),          -- 经度
    level VARCHAR(10),                    -- A级等级(5A/4A/3A)
    type VARCHAR(50),                     -- 景点类型
    description TEXT,                      -- 简介
    ticket_price DECIMAL(10,2),           -- 门票价格
    opening_hours VARCHAR(255),           -- 开放时间
    best_season VARCHAR(100),             -- 最佳季节
    tel VARCHAR(50),                       -- 电话
    website VARCHAR(255),                  -- 官网
    tags JSON,                             -- 标签
    rating DECIMAL(3,2) DEFAULT 0,        -- 评分
    review_count INT DEFAULT 0,            -- 点评数
    visit_count INT DEFAULT 0,            -- 访问次数
    checkin_count INT DEFAULT 0,          -- 打卡次数
    image_count INT DEFAULT 0,            -- 图片数
    is_verified BOOLEAN DEFAULT FALSE,    -- 是否官方认证
    status ENUM('active', 'hidden', 'deleted') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (province_id) REFERENCES provinces(id),
    FOREIGN KEY (city_id) REFERENCES cities(id)
);

-- 用户提交景点表（待审核）
CREATE TABLE user_submitted_spots (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,           -- 景点名称
    province VARCHAR(100) NOT NULL,       -- 省份
    city VARCHAR(100) NOT NULL,           -- 城市
    district VARCHAR(100),                -- 区县
    address VARCHAR(500),                 -- 地址
    location_lat DECIMAL(10, 7),          -- 纬度
    location_lng DECIMAL(10, 7),          -- 经度
    description TEXT,                      -- 简介
    ticket_price DECIMAL(10,2),           -- 门票价格
    opening_hours VARCHAR(255),           -- 开放时间
    images JSON,                          -- 提交的图片
    submitter_id VARCHAR(36) NOT NULL,   -- 提交者ID
    submitter_name VARCHAR(50),           -- 提交者用户名
    status ENUM('pending', 'approved', 'rejected', 'duplicate') DEFAULT 'pending',
    reviewer_id VARCHAR(36),               -- 审核者ID
    reviewer_notes TEXT,                   -- 审核备注
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    approved_spot_id VARCHAR(36),         -- 审核通过后对应的景点ID
    FOREIGN KEY (submitter_id) REFERENCES users(id)
);

-- 景点图片表
CREATE TABLE spot_images (
    id VARCHAR(36) PRIMARY KEY,
    spot_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36),                  -- 上传用户
    url VARCHAR(500) NOT NULL,            -- 图片URL
    thumbnail_url VARCHAR(500),          -- 缩略图URL
    caption VARCHAR(255),                 -- 图片说明
    is_primary BOOLEAN DEFAULT FALSE,     -- 是否主图
    is_verified BOOLEAN DEFAULT FALSE,    -- 是否官方认证
    status ENUM('active', 'hidden', 'deleted') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (spot_id) REFERENCES spots(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 用户打卡记录表
CREATE TABLE checkins (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    spot_id VARCHAR(36) NOT NULL,
    spot_name VARCHAR(255),               -- 景点名称（冗余字段）
    checkin_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rating TINYINT,                       -- 评分1-5
    review TEXT,                           -- 简短点评
    photos JSON,                          -- 打卡照片
    weather VARCHAR(50),                   -- 天气
    companion VARCHAR(50),                 -- 同行人
    visit_type ENUM('alone', 'family', 'friends', 'couple', 'business') DEFAULT 'friends',
    status ENUM('active', 'hidden') DEFAULT 'active',
    likes_count INT DEFAULT 0,            -- 点赞数
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (spot_id) REFERENCES spots(id)
);

-- 用户点评表
CREATE TABLE reviews (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    spot_id VARCHAR(36) NOT NULL,
    rating DECIMAL(3,2) NOT NULL,         -- 评分
    title VARCHAR(255),                    -- 点评标题
    content TEXT NOT NULL,                 -- 点评内容
    images JSON,                          -- 图片
    likes_count INT DEFAULT 0,            -- 点赞数
    status ENUM('active', 'hidden', 'deleted') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (spot_id) REFERENCES spots(id)
);

-- 点赞记录表
CREATE TABLE likes (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    target_type ENUM('checkin', 'review', 'image') NOT NULL,
    target_id VARCHAR(36) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_like (user_id, target_type, target_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 用户关注表（关注其他用户）
CREATE TABLE follows (
    id VARCHAR(36) PRIMARY KEY,
    follower_id VARCHAR(36) NOT NULL,      -- 关注者
    following_id VARCHAR(36) NOT NULL,     -- 被关注者
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_follow (follower_id, following_id),
    FOREIGN KEY (follower_id) REFERENCES users(id),
    FOREIGN KEY (following_id) REFERENCES users(id)
);

-- 通知表
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    type VARCHAR(50) NOT NULL,           -- 通知类型
    title VARCHAR(255) NOT NULL,          -- 标题
    content TEXT,                          -- 内容
    related_id VARCHAR(36),                -- 关联ID
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ================================================
-- 索引设计
-- ================================================
CREATE INDEX idx_spots_province ON spots(province_id);
CREATE INDEX idx_spots_city ON spots(city_id);
CREATE INDEX idx_spots_level ON spots(level);
CREATE INDEX idx_spots_rating ON spots(rating DESC);
CREATE INDEX idx_checkins_user ON checkins(user_id);
CREATE INDEX idx_checkins_spot ON checkins(spot_id);
CREATE INDEX idx_reviews_spot ON reviews(spot_id);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);
CREATE INDEX idx_submitted_status ON user_submitted_spots(status);
CREATE INDEX idx_points_user ON points_history(user_id);
CREATE INDEX idx_images_spot ON spot_images(spot_id);

-- ================================================
-- 触发器：自动更新景点统计
-- ================================================

-- 打卡后更新景点打卡数
DELIMITER //
CREATE TRIGGER after_checkin_insert
AFTER INSERT ON checkins
FOR EACH ROW
BEGIN
    UPDATE spots SET checkin_count = checkin_count + 1 WHERE id = NEW.spot_id;
END//

-- 新点评后更新景点评分
CREATE TRIGGER after_review_insert
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    DECLARE avg_rating DECIMAL(3,2);
    SELECT AVG(rating) INTO avg_rating FROM reviews WHERE spot_id = NEW.spot_id AND status = 'active';
    UPDATE spots SET rating = avg_rating, review_count = review_count + 1 WHERE id = NEW.spot_id;
END//

-- 新图片后更新景点图片数
CREATE TRIGGER after_image_insert
AFTER INSERT ON spot_images
FOR EACH ROW
BEGIN
    UPDATE spots SET image_count = image_count + 1 WHERE id = NEW.spot_id;
END//
DELIMITER ;
