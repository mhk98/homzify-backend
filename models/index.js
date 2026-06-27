const db = require("../db/db");
const { DataTypes } = require("sequelize");

// =====================
// Define models
// =====================

// Core
db.user = require("../app/modules/user/user.model")(db.sequelize, DataTypes);
db.rolePermission =
  require("../app/modules/rolePermission/rolePermission.model")(
    db.sequelize,
    DataTypes,
  );
db.userLogHistory =
  require("../app/modules/userLogHistory/userLogHistory.model")(
    db.sequelize,
    DataTypes,
  );
db.notification = require("../app/modules/notification/notification.model")(
  db.sequelize,
  DataTypes,
);

// Products
db.product = require("../app/modules/product/product.model")(
  db.sequelize,
  DataTypes,
);
db.variation = require("../app/modules/variation/variation.model")(
  db.sequelize,
  DataTypes,
);
db.category = require("../app/modules/category/category.model")(
  db.sequelize,
  DataTypes,
);
db.subcategory = require("../app/modules/subcategory/subcategory.model")(
  db.sequelize,
  DataTypes,
);
db.childcategory = require("../app/modules/childcategory/childcategory.model")(
  db.sequelize,
  DataTypes,
);
db.brand = require("../app/modules/brand/brand.model")(db.sequelize, DataTypes);
db.color = require("../app/modules/color/color.model")(db.sequelize, DataTypes);
db.attribute = require("../app/modules/attribute/attribute.model")(
  db.sequelize,
  DataTypes,
);
db.review = require("../app/modules/review/review.model")(
  db.sequelize,
  DataTypes,
);

// Supplier
db.supplier = require("../app/modules/supplier/supplier.model")(
  db.sequelize,
  DataTypes,
);
db.supplierHistory =
  require("../app/modules/supplierHistory/supplierHistory.model")(
    db.sequelize,
    DataTypes,
  );

// Purchase
db.purchaseRequisition =
  require("../app/modules/purchaseRequision/purchaseRequisition.model")(
    db.sequelize,
    DataTypes,
  );

// Expenses
db.expenseCategory = require("../app/modules/expense/expenseCategory.model")(
  db.sequelize,
  DataTypes,
);
db.expense = require("../app/modules/expense/expense.model")(
  db.sequelize,
  DataTypes,
);

// Orders
db.order = require("../app/modules/order/order.model")(db.sequelize, DataTypes);

// Charge Settings (4 sub-models)
db.codCharge = require("../app/modules/chargeSetting/codCharge.model")(
  db.sequelize,
  DataTypes,
);
db.codChange = require("../app/modules/chargeSetting/codChange.model")(
  db.sequelize,
  DataTypes,
);
db.deliveryCharge =
  require("../app/modules/chargeSetting/deliveryCharge.model")(
    db.sequelize,
    DataTypes,
  );
db.deliveryAdvance =
  require("../app/modules/chargeSetting/deliveryAdvance.model")(
    db.sequelize,
    DataTypes,
  );

// Website / Settings
db.ipBlock = require("../app/modules/ipBlock/ipBlock.model")(
  db.sequelize,
  DataTypes,
);
db.siteSetting = require("../app/modules/siteSetting/siteSetting.model")(
  db.sequelize,
  DataTypes,
);
db.orderStatus = require("../app/modules/orderStatus/orderStatus.model")(
  db.sequelize,
  DataTypes,
);
db.websitePage = require("../app/modules/websitePage/websitePage.model")(
  db.sequelize,
  DataTypes,
);

// Marketing / API
db.tagManager = require("../app/modules/tagManager/tagManager.model")(
  db.sequelize,
  DataTypes,
);
db.facebookPixel = require("../app/modules/facebookPixel/facebookPixel.model")(
  db.sequelize,
  DataTypes,
);
db.tiktokPixel = require("../app/modules/tiktokPixel/tiktokPixel.model")(
  db.sequelize,
  DataTypes,
);
db.googleAds = require("../app/modules/googleAds/googleAds.model")(
  db.sequelize,
  DataTypes,
);
db.bannerCategory =
  require("../app/modules/bannerCategory/bannerCategory.model")(
    db.sequelize,
    DataTypes,
  );
db.banner = require("../app/modules/banner/banner.model")(
  db.sequelize,
  DataTypes,
);
db.couponCode = require("../app/modules/couponCode/couponCode.model")(
  db.sequelize,
  DataTypes,
);
db.visitorStat = require("../app/modules/visitorStat/visitorStat.model")(
  db.sequelize,
  DataTypes,
);
db.landingPage = require("../app/modules/landingPage/landingPage.model")(
  db.sequelize,
  DataTypes,
);

// =====================
// Associations
// =====================

db.user.hasMany(db.notification, { foreignKey: "userId", as: "notifications" });
db.notification.belongsTo(db.user, { foreignKey: "userId", as: "user" });

db.expenseCategory.hasMany(db.expense, {
  foreignKey: "categoryId",
  as: "expenses",
});
db.expense.belongsTo(db.expenseCategory, {
  foreignKey: "categoryId",
  as: "category",
});

// Product <-> Variation
db.product.hasMany(db.variation, { foreignKey: "productId", as: "variations" });
db.variation.belongsTo(db.product, { foreignKey: "productId", as: "product" });

// Supplier <-> SupplierHistory
db.supplier.hasMany(db.supplierHistory, { foreignKey: "supplierId" });
db.supplierHistory.belongsTo(db.supplier, {
  foreignKey: "supplierId",
  as: "supplier",
});

// Banner <-> BannerCategory
db.bannerCategory.hasMany(db.banner, {
  foreignKey: "categoryId",
  as: "banners",
});
db.banner.belongsTo(db.bannerCategory, {
  foreignKey: "categoryId",
  as: "category",
});

// Supplier <-> PurchaseRequisition
db.supplier.hasMany(db.purchaseRequisition, { foreignKey: "supplierId" });
db.purchaseRequisition.belongsTo(db.supplier, {
  foreignKey: "supplierId",
  as: "supplier",
});

// =====================
// Sync helpers
// =====================

const ensureUserRoleColumn = async () => {
  const queryInterface = db.sequelize.getQueryInterface();
  const tableName = db.user.getTableName();
  const tableDefinition = await queryInterface.describeTable(tableName);
  const definition = {
    type: DataTypes.STRING(64),
    allowNull: true,
    defaultValue: "user",
  };
  if (!tableDefinition.role) {
    await queryInterface.addColumn(tableName, "role", definition);
    return;
  }
  await queryInterface.changeColumn(tableName, "role", definition);
};

const ensureUserStatusColumn = async () => {
  const queryInterface = db.sequelize.getQueryInterface();
  const tableName = db.user.getTableName();
  const tableDefinition = await queryInterface.describeTable(tableName);
  if (!tableDefinition.status) {
    await queryInterface.addColumn(tableName, "status", {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "Active",
    });
  }
  await db.sequelize.query(
    `UPDATE \`${tableName}\` SET status = 'Active' WHERE status IS NULL OR TRIM(status) = ''`,
  );
};

const ensureUserDocumentColumns = async () => {
  const queryInterface = db.sequelize.getQueryInterface();
  const tableName = db.user.getTableName();
  const tableDefinition = await queryInterface.describeTable(tableName);
  const maybeAddColumn = async (columnName) => {
    if (!tableDefinition[columnName]) {
      await queryInterface.addColumn(tableName, columnName, {
        type: DataTypes.STRING,
        allowNull: true,
      });
    }
  };
  await maybeAddColumn("idCard");
  await maybeAddColumn("cv");
  await maybeAddColumn("guardianPhoto");
  await maybeAddColumn("guardianIdCard");
};

const ensureSupplierStatusNoteColumns = async () => {
  const queryInterface = db.sequelize.getQueryInterface();
  const tableName = db.supplier.getTableName();
  const tableDefinition = await queryInterface.describeTable(tableName);
  if (!tableDefinition.note) {
    await queryInterface.addColumn(tableName, "note", {
      type: DataTypes.STRING,
      allowNull: true,
    });
  }
  if (!tableDefinition.status) {
    await queryInterface.addColumn(tableName, "status", {
      type: DataTypes.STRING(32),
      allowNull: true,
      defaultValue: "Active",
    });
  }
};

const ensureProductStatusNoteColumns = async () => {
  const queryInterface = db.sequelize.getQueryInterface();
  const tableName = db.product.getTableName();
  const tableDefinition = await queryInterface.describeTable(tableName);
  if (!tableDefinition.note) {
    await queryInterface.addColumn(tableName, "note", {
      type: DataTypes.STRING,
      allowNull: true,
    });
  }
  if (!tableDefinition.status) {
    await queryInterface.addColumn(tableName, "status", {
      type: DataTypes.STRING(32),
      allowNull: true,
      defaultValue: "Active",
    });
  }
};

const ensureCategoryFrontendColumns = async () => {
  const queryInterface = db.sequelize.getQueryInterface();
  const tableName = db.category.getTableName();
  const tableDefinition = await queryInterface.describeTable(tableName);
  const maybeAdd = async (columnName, definition) => {
    if (!tableDefinition[columnName]) {
      await queryInterface.addColumn(tableName, columnName, definition);
    }
  };

  await maybeAdd("status", {
    type: DataTypes.STRING(32),
    allowNull: false,
    defaultValue: "Active",
  });
  await maybeAdd("imageFile", {
    type: DataTypes.TEXT("long"),
    allowNull: true,
  });
  await maybeAdd("image", { type: DataTypes.TEXT("long"), allowNull: true });
  await maybeAdd("bannerImage", {
    type: DataTypes.TEXT("long"),
    allowNull: true,
  });
  await maybeAdd("sortOrder", { type: DataTypes.INTEGER(10), allowNull: true });
  await maybeAdd("isActive", {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  });
  await maybeAdd("frontView", {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  });
  await maybeAdd("metaTitle", { type: DataTypes.STRING, allowNull: true });
  await maybeAdd("metaDescription", { type: DataTypes.TEXT, allowNull: true });
};

const ensurePurchaseRequisitionItemsColumn = async () => {
  const queryInterface = db.sequelize.getQueryInterface();
  const tableName = db.purchaseRequisition.getTableName();
  const tableDefinition = await queryInterface.describeTable(tableName);
  if (!tableDefinition.items) {
    await queryInterface.addColumn(tableName, "items", {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    });
  }
};

const ensurePurchaseRequisitionExtraColumns = async () => {
  const queryInterface = db.sequelize.getQueryInterface();
  const tableName = db.purchaseRequisition.getTableName();
  const tableDefinition = await queryInterface.describeTable(tableName);
  const maybeAdd = async (columnName, definition) => {
    if (!tableDefinition[columnName]) {
      await queryInterface.addColumn(tableName, columnName, definition);
    }
  };
  await maybeAdd("productId", { type: DataTypes.INTEGER(10), allowNull: true });
  await maybeAdd("assetId", { type: DataTypes.INTEGER(10), allowNull: true });
  await maybeAdd("bookId", { type: DataTypes.INTEGER(10), allowNull: true });
  await maybeAdd("file", { type: DataTypes.STRING, allowNull: true });
  await maybeAdd("paymentMode", { type: DataTypes.STRING, allowNull: true });
  await maybeAdd("bankName", { type: DataTypes.STRING, allowNull: true });
  await maybeAdd("bankAccount", { type: DataTypes.INTEGER, allowNull: true });
};

const ensureLandingPageContentColumns = async () => {
  const queryInterface = db.sequelize.getQueryInterface();
  const tableName = db.landingPage.getTableName();
  const tableDefinition = await queryInterface.describeTable(tableName);
  const maybeAdd = async (columnName, definition) => {
    if (!tableDefinition[columnName]) {
      await queryInterface.addColumn(tableName, columnName, definition);
    }
  };
  const maybeChange = async (columnName, definition) => {
    if (tableDefinition[columnName]) {
      await queryInterface.changeColumn(tableName, columnName, definition);
    }
  };

  await maybeAdd("productId", { type: DataTypes.INTEGER(10), allowNull: true });
  await maybeAdd("product", { type: DataTypes.STRING, allowNull: true });
  await maybeAdd("title", { type: DataTypes.STRING, allowNull: false });
  await maybeAdd("subTitle", { type: DataTypes.STRING, allowNull: true });
  await maybeAdd("bannerImageUrl", {
    type: DataTypes.TEXT("long"),
    allowNull: true,
  });
  await maybeAdd("prizeImageUrl", {
    type: DataTypes.TEXT("long"),
    allowNull: true,
  });
  await maybeAdd("reviewImages", {
    type: DataTypes.TEXT("long"),
    allowNull: true,
  });
  await maybeAdd("shortDescription", { type: DataTypes.TEXT, allowNull: true });
  await maybeAdd("video", { type: DataTypes.STRING(500), allowNull: true });
  await maybeAdd("reviewTitle", { type: DataTypes.STRING, allowNull: true });
  await maybeAdd("descriptionTitle", {
    type: DataTypes.STRING,
    allowNull: true,
  });
  await maybeAdd("description", { type: DataTypes.TEXT, allowNull: true });
  await maybeAdd("whyChooseTitle", { type: DataTypes.STRING, allowNull: true });
  await maybeAdd("whyChooseUs", { type: DataTypes.TEXT, allowNull: true });
  await maybeAdd("price", { type: DataTypes.DECIMAL(10, 2), allowNull: true });
  await maybeAdd("originalPrice", {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  });
  await maybeAdd("phone", { type: DataTypes.STRING, allowNull: true });
  await maybeAdd("template", { type: DataTypes.STRING, allowNull: true });
  await maybeAdd("countdown", { type: DataTypes.STRING(64), allowNull: true });
  await maybeAdd("status", {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  });
  await maybeAdd("deletedAt", { type: DataTypes.DATE, allowNull: true });

  await maybeChange("bannerImageUrl", {
    type: DataTypes.TEXT("long"),
    allowNull: true,
  });
  await maybeChange("prizeImageUrl", {
    type: DataTypes.TEXT("long"),
    allowNull: true,
  });
  await maybeChange("reviewImages", {
    type: DataTypes.TEXT("long"),
    allowNull: true,
  });
};

const ensureOrderIpAddressColumn = async () => {
  const queryInterface = db.sequelize.getQueryInterface();
  const tableName = db.order.getTableName();
  const tableDefinition = await queryInterface.describeTable(tableName);
  if (!tableDefinition.ipAddress) {
    await queryInterface.addColumn(tableName, "ipAddress", {
      type: DataTypes.STRING(128),
      allowNull: true,
    });
  }
};

const ensureOrderStatusColumn = async () => {
  const queryInterface = db.sequelize.getQueryInterface();
  const tableName = db.order.getTableName();
  const tableDefinition = await queryInterface.describeTable(tableName);
  if (!tableDefinition.status) {
    await queryInterface.addColumn(tableName, "status", {
      type: DataTypes.STRING(64),
      allowNull: false,
      defaultValue: "pending",
    });
    return;
  }
  await queryInterface.changeColumn(tableName, "status", {
    type: DataTypes.STRING(64),
    allowNull: false,
    defaultValue: "pending",
  });
};

// =====================
// Sync
// =====================

db.sequelize
  .sync({ force: false })
  .then(async () => {
    await ensureUserRoleColumn();
    await ensureUserStatusColumn();
    await ensureUserDocumentColumns();
    await ensureSupplierStatusNoteColumns();
    await ensureProductStatusNoteColumns();
    await ensureCategoryFrontendColumns();
    await ensurePurchaseRequisitionItemsColumn();
    await ensurePurchaseRequisitionExtraColumns();
    await ensureOrderIpAddressColumn();
    await ensureOrderStatusColumn();
    await ensureLandingPageContentColumns();
    console.log("Connection re-synced successfully");
  })
  .catch((err) => console.error("Error on re-sync:", err));

module.exports = db;
