export const navigation = [
  // {name: 'home', url: '/home', icon: 'fa fa-dashboard', role: 'ROLESHOWPRODUCTIONSCHEDULEMONITORIN'}, // , badge: { variant: 'info', text: 'NEW'} },
  { title: true, name: "Meta Smart Factory" },
  { name: "dashboard", url: "/dashboard", icon: "fa fa-tachometer" },
  {
    name: "equipment-monitoring",
    url: "/equipment-monitoring",
    icon: "fa fa-line-chart",
  },

  // {
  //   name: 'kpi-reports', url: '/kpi-reports', icon: 'icon-chart',
  //   children: [
  //     { name: 'dashboard-kpi', url: '/kpi-reports/dashboard-kpi', icon: 'icon-chart' }
  //   ]
  // },

  {
    name: "inventory-management",
    url: "/inventory-management",
    icon: "fa fa-shopping-cart",
    role: "ROLE_ORDER_MANAGEMENT",
    children: [
      {
        name: "order-management",
        url: "/inventory-management/order-management",
        icon: "fa fa-tasks",
        role: "ROLE_ORDER_MANAGEMENT",
        class: "bg-third",
        children: [
          {
            name: "sales-dashboard",
            url: "/inventory-management/order-management/sales-dashboard/view",
            icon: "icon-chart",
          },
          {
            name: "account-management",
            url: "/inventory-management/order-management/account-management",
            icon: "fa fa-industry",
            role: "ROLE_ACCOUNT_VIEW",
            class: "bg-fourth",
            children: [
              {
                name: "account-s",
                url: "/inventory-management/order-management/account-management/accounts",
                icon: "fa fa-address-card",
                role: "ROLE_ACCOUNT_VIEW",
              },
              {
                name: "account-types",
                url: "/inventory-management/order-management/account-management/account-types",
                icon: "fa fa-address-card",
                role: "ROLE_ACCOUNT_VIEW",
              },
            ],
          },
          {
            name: "invoices",
            url: "/inventory-management/order-management/invoices",
            icon: "fa fa-gear",
            role: "ROLE_SALE_ORDER_VIEW",
          },
          {
            name: "sales-order-management",
            url: "/inventory-management/order-management/sales-orders",
            icon: "fa fa-industry",
            role: "ROLE_SALE_ORDER_VIEW",
            class: "bg-fourth",
            children: [
              {
                name: "sales-quotations",
                url: "/inventory-management/order-management/sales-orders/quotations/items",
                icon: "icon-chart",
                role: "ROLE_SALE_ORDER_VIEW",
              },
              {
                name: "sales-orders",
                url: "/inventory-management/order-management/sales-orders/base/items",
                icon: "icon-chart",
                role: "ROLE_SALE_ORDER_VIEW",
              },
            ],
          },

          // { name: 'sales-orders-items', url: '/orders/sales/items', icon: 'icon-chart', role: 'ROLE_SALE_ORDER_VIEW' },
          {
            name: "purchase-order-management",
            url: "/inventory-management/order-management/purchase-orders",
            icon: "fa fa-industry",
            role: "ROLE_PURCHASE_ORDER_VIEW",
            class: "bg-fourth",
            children: [
              {
                name: "purchase-quotations",
                url: "/inventory-management/order-management/purchase-orders/quotations",
                icon: "icon-basket-loaded",
                role: "ROLE_PURCHASE_ORDER_VIEW",
              },
              {
                name: "purchase-orders",
                url: "/inventory-management/order-management/purchase-orders/base/items",
                icon: "icon-basket-loaded",
                role: "ROLE_PURCHASE_ORDER_VIEW",
              },
            ],
          },
          // { name: 'purchase-orders-items', url: '/orders/porders/items', icon: 'icon-basket-loaded', role: 'ROLE_PURCHASE_ORDER_VIEW' },
        ],
      },
      {
        name: "warehouse-management-system",
        url: "/inventory-management/warehouse-management-system",
        icon: "fa fa-industry",
        role: "ROLE_WAREHOUSE_MANAGEMENT_SYSTEM",
        class: "bg-third",
        children: [
          // {name: 'basic-warehouse-management', url: '/inventory-management/warehouse-management-system/basic', icon: 'fa fa-industry', role: 'ROLE_WAREHOUSE_MANAGEMENT_SYSTEM', class: 'bg-fourth',
          // children: [
          {
            name: "material-master",
            url: "/inventory-management/warehouse-management-system/basic/material-cards",
            icon: "fa fa-cube",
            role: "ROLE_MATERIAL_MASTER_VIEW",
          },
          // { name: 'goods-movement', url: '/inventory-management/warehouse-management-system/basic/goods-movement/base', icon: 'fa fa-truck', role: 'ROLE_GOODS_MOVEMENT_VIEW' },
          // { name: 'goods-movement-items', url: '/inventory-management/warehouse-management-system/basic/goods-movement/items', icon: 'fa fa-truck', role: 'ROLE_GOODS_MOVEMENT_VIEW' },
          // { name: 'stock-reports', url: '/inventory-management/warehouse-management-system/basic/stock-reports', icon: 'fa fa-database', role: 'ROLE_STOCK_REPORTS_VIEW' },
          // ]},
          // {name: 'advance-warehouse-management', url: '/inventory-management/warehouse-management-system/advance', icon: 'fa fa-industry', role: 'ROLE_WAREHOUSE_MANAGEMENT_SYSTEM', class: 'bg-fourth',
          // children: [
          {
            name: "pallet-records",
            url: "/inventory-management/warehouse-management-system/advance/pallet-records",
            icon: "fa fa-truck",
            role: "ROLE_GOODS_MOVEMENT_VIEW",
          },
          {
            name: "automatic_dispatching_management",
            url: "/inventory-management/warehouse-management-system/advance/notification-dashboard",
            icon: "fa fa-truck",
            role: "ROLE_GOODS_MOVEMENT_VIEW",
          },
          {
            name: "transfer_operations",
            url: "/inventory-management/warehouse-management-system/advance/transfer-operations",
            icon: "fa fa-truck",
            role: "ROLE_GOODS_MOVEMENT_VIEW",
          },
          {
            name: "dispatcher",
            url: "/inventory-management/warehouse-management-system/advance/notification-dashboard-dispatcher/dispatcher",
            icon: "fa fa-truck",
            role: "ROLE_GOODS_MOVEMENT_VIEW",
          },
          {
            name: "dispatcher-mobile",
            url: "/inventory-management/warehouse-management-system/advance/notification-dashboard-dispatcher-mobile",
            icon: "fa fa-truck",
            role: "ROLE_GOODS_MOVEMENT_VIEW",
          },
          {
            name: "advanced-stock-reports",
            url: "/inventory-management/warehouse-management-system/advance/advanced-stock-reports",
            icon: "fa fa-database",
            role: "ROLE_ADVANCED_STOCK_REPORTS_VIEW",
          },
          {
            name: "reservation",
            url: "/inventory-management/warehouse-management-system/advance/reservations",
            icon: "fa fa-cube",
            role: "ROLE_RESERVATION_VIEW",
          },
          {
            name: "batch",
            url: "/inventory-management/warehouse-management-system/advance/batch",
            icon: "fa fa-tag",
            role: "ROLE_BATCH_VIEW",
          },
          // ]},
          // { name: 'goods-movement-notification-dashboard', url: '/stocks/good-movement/notification-dashboard', icon: 'fa fa-truck', role: 'ROLE_GOODS_MOVEMENT_VIEW' },
        ],
      },
    ],
  },
  {
    name: "manufacturing-planning-system",
    url: "/manufacturing-planning",
    icon: "fa fa-tasks",
    role: "ROLE_MANUFACTURING_PLANNING_SYSTEM",
    children: [
      {
        name: "basic-manufacturing-planning",
        url: "/manufacturing-planning/basic",
        icon: "fa fa-tasks",
        role: "ROLE_MANUFACTURING_PLANNING_SYSTEM",
        class: "bg-third",
        children: [
          {
            name: "planning-management",
            url: "/manufacturing-planning/basic/management",
            icon: "fa fa-tasks",
            role: "ROLE_PLANNING_MANAGEMENT_VIEW",
            class: "bg-fourth",
            children: [
              {
                name: "product-tree",
                url: "/manufacturing-planning/basic/management/product-tree",
                icon: "fa fa-leaf",
                role: "ROLE_PRODUCT_TREE_VIEW",
              },
              {
                name: "projects",
                url: "/manufacturing-planning/basic/management/projects",
                icon: "fa fa-leaf",
                role: "ROLE_PLANNING_MANAGEMENT_VIEW",
              },
              {
                name: "prod-order-list",
                url: "/manufacturing-planning/basic/management/prod-list",
                icon: "fa fa-leaf",
                role: "ROLE_PLANNING_MANAGEMENT_VIEW",
              },
              {
                name: "job-order-list",
                url: "/manufacturing-planning/basic/management/job-order-list",
                icon: "fa fa-leaf",
                role: "ROLE_PLANNING_MANAGEMENT_VIEW",
              },
              {
                name: "job-order-planning",
                url: "/manufacturing-planning/basic/management/job-order-planning",
                icon: "fa fa-leaf",
                role: "ROLE_PLANNING_MANAGEMENT_VIEW",
              },
              {
                name: "production-schedule",
                url: "/manufacturing-planning/basic/management/production-manual",
                icon: "fa fa-calendar",
                role: "ROLE_PRODUCTION_SCHEDULE_VIEW",
              },
              // { name: 'job-order-follow', url: '/manufacturing-planning/basic/management/job-order-follow', icon: 'fa fa-leaf', role: 'ROLE_PLANNING_MANAGEMENT_VIEW' },
              {
                name: "stop-list",
                url: "/manufacturing-planning/basic/management/stop/list",
                icon: "fa fa-leaf",
                role: "ROLE_PLANNING_MANAGEMENT_VIEW",
              },
              // { name: 'manual-job-orders', url: '/manufacturing-planning/basic/management/manual/list', icon: 'fa fa-leaf', role: 'ROLE_PLANNING_MANAGEMENT_VIEW' }
            ],
          },
        ],
      },
      {
        name: "advance-manufacturing-planning",
        url: "/manufacturing-planning/advance",
        icon: "fa fa-tasks",
        role: "ROLE_MANUFACTURING_PLANNING_SYSTEM",
        class: "bg-third",
        children: [
          {
            name: "real-time-production-monitoring",
            url: "/manufacturing-planning/advance/production-monitoring",
            icon: "fa fa-leaf",
            role: "ROLE_PRODUCT_TREE_VIEW",
          },
          {
            name: "production-auto-schedule",
            url: "/manufacturing-planning/advance/job-order-auto-scheduler",
            icon: "fa fa-calendar",
            role: "ROLE_PRODUCTION_SCHEDULE_VIEW",
          },
          {
            name: "labor-auto-schedule",
            url: "/manufacturing-planning/advance/labor-auto-scheduler",
            icon: "fa fa-calendar",
            role: "ROLE_PRODUCTION_SCHEDULE_VIEW",
          },
          {
            name: "simulation-management",
            url: "/manufacturing-planning/advance/simulation-management",
            icon: "icon-chart",
            role: "ROLE_PRODUCTION_SCHEDULE_VIEW",
          },
          {
            name: "project-auto-schedule",
            url: "/manufacturing-planning/advance/project-auto-scheduler",
            icon: "fa fa-calendar",
            role: "ROLE_PRODUCTION_SCHEDULE_VIEW",
          },
          {
            name: "material-handling-simulation",
            url: "/manufacturing-planning/advance/material-handling-simulation",
            icon: "icon-chart",
            role: "ROLE_PRODUCTION_SCHEDULE_VIEW",
          },
        ],
      },
    ],
  },
  {
    name: "quality-control-system",
    url: "/qualitycontrol",
    icon: "fa fa-line-chart",
    role: "ROLE_QUALITY_CONTROL_SYSTEM",
    children: [
      // ******** Quality-Planing and their children Define **********

      {
        name: "basic-quality-control",
        url: "/qualitycontrol/basic",
        icon: "fa fa-line-chart",
        role: "ROLE_QUALITY_CONTROL_SYSTEM",
        class: "bg-third",
        children: [
          {
            name: "scraps",
            url: "/qualitycontrol/basic/scrap",
            icon: "fa fa-gear",
            role: "ROLE_SCRAPS_VIEW",
          },
          {
            name: "rework",
            url: "/qualitycontrol/basic/rework",
            icon: "fa fa-gear",
            role: "ROLE_REWORK_VIEW",
          },
          {
            name: "scrap-and-rework-types",
            url: "/qualitycontrol/basic/scrap-and-rework-types",
            icon: "fa fa-gear",
            role: "ROLE_QUALITY_SETTINGS",
          },
          {
            name: "scrap-cause",
            url: "/qualitycontrol/basic/scrapcause",
            icon: "fa fa-gear",
            role: "ROLE_QUALITY_SETTINGS",
          },
          {
            name: "scrap-rework-cause",
            url: "/qualitycontrol/basic/scrap-rework-cause",
            icon: "fa fa-gear",
            role: "ROLE_QUALITY_SETTINGS",
          },
        ],
      },
      {
        name: "advanced-quality-control",
        url: "/qualitycontrol/advance",
        icon: "fa fa-line-chart",
        role: "ROLE_QUALITY_CONTROL_SYSTEM",
        class: "bg-third",
        children: [
          {
            name: "quality-settings",
            url: "/qualitycontrol/advance/qualitysettings",
            icon: "fa fa-industry",
            role: "ROLE_QUALITY_SETTINGS",
            class: "bg-fourth",
            children: [
              {
                name: "quality-control-key",
                url: "/qualitycontrol/advance/qualitysettings/quality-control-key",
                icon: "fa fa-gear",
                role: "ROLE_QUALITY_SETTINGS",
              },
              {
                name: "quality-systems",
                url: "/qualitycontrol/advance/qualitysettings/quality-systems",
                icon: "fa fa-gear",
                role: "ROLE_QUALITY_SETTINGS",
              },
              {
                name: "sampling-type",
                url: "/qualitycontrol/advance/qualitysettings/sampling-type",
                icon: "fa fa-gear",
                role: "ROLE_QUALITY_SETTINGS",
              },
              {
                name: "valuation-mode",
                url: "/qualitycontrol/advance/qualitysettings/valuation-mode",
                icon: "fa fa-gear",
                role: "ROLE_QUALITY_SETTINGS",
              },
              {
                name: "inspection-operation",
                url: "/qualitycontrol/advance/qualitysettings/inspection-operation",
                icon: "fa fa-gear",
                role: "ROLE_QUALITY_SETTINGS",
              },
              {
                name: "quality-notification-type",
                url: "/qualitycontrol/advance/qualitysettings/quality-notification-type",
                icon: "fa fa-gear",
                role: "ROLE_QUALITY_SETTINGS",
              },
              {
                name: "quality-report-type",
                url: "/qualitycontrol/advance/qualitysettings/quality-report-type",
                icon: "fa fa-gear",
                role: "ROLE_QUALITY_SETTINGS",
              },
              {
                name: "defect-type",
                url: "/qualitycontrol/advance/qualitysettings/defect-type",
                icon: "fa fa-gear",
                role: "ROLE_QUALITY_SETTINGS",
              },
              {
                name: "defect-location",
                url: "/qualitycontrol/advance/qualitysettings/defect-location",
                icon: "fa fa-gear",
                role: "ROLE_QUALITY_SETTINGS",
              },
              {
                name: "quality-cause-type",
                url: "/qualitycontrol/advance/qualitysettings/quality-causes",
                icon: "fa fa-gear",
                role: "ROLE_QUALITY_SETTINGS",
              },
              {
                name: "quality-task-type",
                url: "/qualitycontrol/advance/qualitysettings/quality-tasks",
                icon: "fa fa-gear",
                role: "ROLE_QUALITY_SETTINGS",
              },
              {
                name: "quality-activity-type",
                url: "/qualitycontrol/advance/qualitysettings/quality-activities",
                icon: "fa fa-gear",
                role: "ROLE_QUALITY_SETTINGS",
              },
              {
                name: "usage-decision-type",
                url: "/qualitycontrol/advance/qualitysettings/usage-decision-type",
                icon: "fa fa-gear",
                role: "ROLE_QUALITY_SETTINGS",
              },
            ],
          },
          {
            name: "quality-planning",
            url: "/qualitycontrol/advance/qualityplannig",
            icon: "fa fa-hourglass-half",
            role: "ROLE_QUALITY_PLANNING_VIEW",
            class: "bg-fourth",
            children: [
              {
                name: "inspection-charateristics",
                url: "/qualitycontrol/advance/qualityplannig/inspectioncharacteristics",
                icon: "fa fa-gear",
                role: "ROLE_QUALITY_PLANNING_VIEW",
              },
              {
                name: "inspection-method",
                url: "/qualitycontrol/advance/qualityplannig/inspectionmethod",
                icon: "fa fa-wrench",
                role: "ROLE_QUALITY_PLANNING_VIEW",
              },
              {
                name: "sampling-procedure",
                url: "/qualitycontrol/advance/qualityplannig/samplingprocedure",
                icon: "fa fa-wrench",
                role: "ROLE_QUALITY_PLANNING_VIEW",
              },
              {
                name: "inspection-plan",
                url: "/qualitycontrol/advance/qualityplannig/inspectionplan",
                icon: "fa fa-wrench",
                role: "ROLE_QUALITY_PLANNING_VIEW",
              },
              {
                name: "quality-info-record",
                url: "/qualitycontrol/advance/qualityplannig/qualityinforecord",
                icon: "fa fa-wrench",
                role: "ROLE_QUALITY_PLANNING_VIEW",
              },
            ],
          },
          {
            name: "quality-inspection",
            url: "/qualitycontrol/advance/qualityinspection",
            icon: "fa fa-hourglass-half",
            role: "ROLE_QUALITY_INSPECTION_VIEW",
            class: "bg-fourth",
            children: [
              {
                name: "inspection-lot",
                url: "/qualitycontrol/advance/qualityinspection/inspectionlot",
                icon: "fa fa-gear",
                role: "ROLE_QUALITY_INSPECTION_VIEW",
              },
            ],
          },
          {
            name: "quality-notification",
            url: "/qualitycontrol/advance/qualitynotification",
            icon: "fa fa-hourglass-half",
            role: "ROLE_QUALITY_NOTIFICATION_VIEW",
          },
        ],
      },
    ],
  },
  {
    name: "maintenance-system",
    url: "/maintenance",
    icon: "fa fa-cubes",
    role: "ROLE_MAINTENANCE_SYSTEM",
    children: [
      {
        name: "maintenance-processing",
        icon: "fa fa-hourglass-half",
        url: "/maintenance/maintenance-processing",
        class: "bg-third",
        role: "ROLE_MAINTENANCE_PROCESSING_VIEW",
        children: [
          {
            name: "notifications",
            url: "/maintenance/maintenance-processing/notifications",
            icon: "fa fa-bell",
            role: "ROLE_MAINTENANCE_PROCESSING_VIEW",
          },
          {
            name: "maintenance-order",
            url: "/maintenance/maintenance-processing/maintenance-order",
            icon: "fa fa-wrench",
            role: "ROLE_MAINTENANCE_PROCESSING_VIEW",
          },
          {
            name: "maintenance-plan",
            url: "/maintenance/maintenance-processing/maintenance-plan",
            icon: "fa fa-wrench",
            role: "ROLE_MAINTENANCE_PROCESSING_VIEW",
          },
        ],
      },
      {
        name: "equipment-technical-objects",
        icon: "fa fa-cube",
        url: "/maintenance/equipment-technical",
        class: "bg-third",
        role: "ROLE_EQUIPMENT_TECHNICAL_OBJECTS_VIEW",
        children: [
          {
            name: "equipments",
            url: "/maintenance/equipment-technical/equipments",
            icon: "fa fa-wrench",
            role: "ROLE_EQUIPMENT_TECHNICAL_OBJECTS_VIEW",
          },
          {
            name: "functional-location",
            url: "/maintenance/equipment-technical/functional-location",
            icon: "fa fa-map-marker",
            role: "ROLE_EQUIPMENT_TECHNICAL_OBJECTS_VIEW",
          },
          {
            name: "abc-indicator",
            url: "/maintenance/equipment-technical/abcindicator",
            icon: "fa fa-truck",
            role: "ROLE_EQUIPMENT_TECHNICAL_OBJECTS_VIEW",
          },
          {
            name: "category",
            url: "/maintenance/equipment-technical/category",
            icon: "fa fa-cube",
            role: "ROLE_EQUIPMENT_TECHNICAL_OBJECTS_VIEW",
          },
          {
            name: "object-types",
            url: "/maintenance/equipment-technical/objecttypes",
            icon: "fa fa-truck",
            role: "ROLE_EQUIPMENT_TECHNICAL_OBJECTS_VIEW",
          },
          {
            name: "catalog",
            url: "/maintenance/equipment-technical/codegroup",
            icon: "fa fa-tasks",
            role: "ROLE_EQUIPMENT_TECHNICAL_OBJECTS_VIEW",
          },
          {
            name: "code-group",
            url: "/maintenance/equipment-technical/codegroupheader",
            icon: "fa fa-cube",
            role: "ROLE_EQUIPMENT_TECHNICAL_OBJECTS_VIEW",
          },
          {
            name: "catalog-profile",
            url: "/maintenance/equipment-technical/codegroupitems",
            icon: "fa fa-truck",
            role: "ROLE_EQUIPMENT_TECHNICAL_OBJECTS_VIEW",
          },
          {
            name: "planner-group",
            url: "/maintenance/equipment-technical/planner-group",
            icon: "fa fa-tasks",
            role: "ROLE_EQUIPMENT_TECHNICAL_OBJECTS_VIEW",
          },
          {
            name: "external-service",
            url: "/maintenance/equipment-technical/external-service",
            icon: "fa fa-wrench",
            role: "ROLE_EQUIPMENT_TECHNICAL_OBJECTS_VIEW",
          },
          {
            name: "equipment-operation",
            url: "/maintenance/equipment-technical/equipment-operation",
            icon: "fa fa-wrench",
            role: "ROLE_EQUIPMENT_TECHNICAL_OBJECTS_VIEW",
          },
        ],
      },
      {
        name: "maintenance-technical-objects",
        icon: "fa fa-tasks",
        url: "/maintenance/maintenance-technical",
        class: "bg-third",
        role: "ROLE_MAINTENANCE_TECHNICAL_OBJECTS_VIEW",
        children: [
          {
            name: "characteristic",
            url: "/maintenance/maintenance-technical/characteristic",
            icon: "fa fa-truck",
            role: "ROLE_MAINTENANCE_TECHNICAL_OBJECTS_VIEW",
          },
          {
            name: "maintenance-strategy",
            url: "/maintenance/maintenance-technical/maintenance-strategy",
            icon: "fa fa-wrench",
            role: "ROLE_MAINTENANCE_TECHNICAL_OBJECTS_VIEW",
          },
          {
            name: "maintenance-cycle-set",
            url: "/maintenance/maintenance-technical/maintenance-cycle-set",
            icon: "fa fa-wrench",
            role: "ROLE_MAINTENANCE_TECHNICAL_OBJECTS_VIEW",
          },
          {
            name: "maintenance-category",
            url: "/maintenance/maintenance-technical/maintenance-category",
            icon: "fa fa-wrench",
            role: "ROLE_MAINTENANCE_TECHNICAL_OBJECTS_VIEW",
          },
          {
            name: "maintenance-system-condition",
            url: "/maintenance/maintenance-technical/maintenance-system-condition",
            icon: "fa fa-wrench",
            role: "ROLE_MAINTENANCE_TECHNICAL_OBJECTS_VIEW",
          },
          // {
          //   name: "maintenance-notification-type",
          //   url: "/maintenance/maintenance-technical/maintenance-notification-type",
          //   icon: "fa fa-wrench",
          //   role: "ROLE_MAINTENANCE_TECHNICAL_OBJECTS_VIEW",
          // },
          // {
          //   name: "maintenance-activity-type",
          //   url: "/maintenance/maintenance-technical/maintenance-activity-type",
          //   icon: "fa fa-wrench",
          //   role: "ROLE_MAINTENANCE_TECHNICAL_OBJECTS_VIEW",
          // },
          // {
          //   name: "maintenance-order-type",
          //   url: "/maintenance/maintenance-technical/maintenance-order-type",
          //   icon: "fa fa-wrench",
          //   role: "ROLE_MAINTENANCE_TECHNICAL_OBJECTS_VIEW",
          // },
          {
            name: "maintenance-reason",
            url: "/maintenance/maintenance-technical/maintenance-reason",
            icon: "fa fa-wrench",
            role: "ROLE_MAINTENANCE_TECHNICAL_OBJECTS_VIEW",
          },
        ],
      },
      {
        name: "equipment-task",
        icon: "fa fa-cube",
        url: "/maintenance/equipment-task",
        class: "bg-third",
        role: "ROLE_EQUIPMENT_TASK_VIEW",
        children: [
          {
            name: "general-task",
            url: "/maintenance/equipment-task/general-task",
            icon: "fa fa-wrench",
            role: "ROLE_EQUIPMENT_TASK_VIEW",
          },
        ],
      },

      {
        name: "measuring",
        url: "/maintenance/measuring",
        icon: "fa fa-cubes",
        class: "bg-third",
        role: "ROLE_MEASURING_VIEW",
        children: [
          {
            name: "measuring-point",
            url: "/maintenance/measuring/measuring-point",
            icon: "fa fa-cube",
            role: "ROLE_MEASURING_VIEW",
          },
          {
            name: "measuring-document",
            url: "/maintenance/measuring/measuring-document",
            icon: "fa fa-cube",
            role: "ROLE_MEASURING_VIEW",
          },
          {
            name: "sensor-data",
            url: "/maintenance/measuring/sensor-data",
            icon: "fa fa-cube",
            role: "ROLE_MEASURING_VIEW",
          },
        ],
      },
      {
        name: "maintenance-report",
        url: "/maintenance/report",
        icon: "fa fa-bar-chart",
        role: "ROLE_MAINTENANCE_REPORT_VIEW",
      },
    ],
  },
  {
    name: "labor-management",
    url: "/labor",
    icon: "fa fa-cubes",
    role: "ROLE_LABOR_MANAGEMENT_SETTINGS",
    children: [
      {
        name: "labor-general-information",
        icon: "fa fa-exchange",
        url: "/labor/general",
        class: "bg-third",
        role: "ROLE_LABOR_MANAGEMENT_SETTINGS",
        children: [
          {
            name: "roles",
            url: "/labor/general/role",
            icon: "fa fa-key",
            role: "ROLE_LABOR_MANAGEMENT_SETTINGS",
          },
          {
            name: "personals",
            url: "/labor/general/staff",
            icon: "fa fa-users",
            role: "ROLE_LABOR_MANAGEMENT_SETTINGS",
          },
          {
            name: "shift-settings",
            url: "/labor/general/shift-settings",
            icon: "fa fa-exchange",
            role: "ROLE_LABOR_MANAGEMENT_SETTINGS",
          },
          {
            name: "employee-groups",
            url: "/labor/general/employee-groups",
            icon: "fa fa-users",
            role: "ROLE_LABOR_MANAGEMENT_SETTINGS",
          },
          // { name: 'capability-list', url: '/labor/capability-list', icon: 'fa fa-users', role: 'ROLE_LABOR_MANAGEMENT_SETTINGS' },

          {
            name: "employee-title",
            url: "/labor/general/employee-title",
            icon: "fa fa-key",
            role: "ROLE_LABOR_MANAGEMENT_SETTINGS",
          },

          
          {
            name: "employee-shift-groups",
            url: "/labor/general/employee-shift-groups",
            icon: "fa fa-users",
            role: "ROLE_LABOR_MANAGEMENT_SETTINGS",
          },
          {
            name: "employee-shift-exception",
            url: "/labor/general/employee-shift-exception",
            icon: "fa fa-shirtsinbulk",
            role: "ROLE_LABOR_MANAGEMENT_SETTINGS",
          },
          {
            name: "generic-group",
            url: "/labor/general/generic-group",
            icon: "fa fa-users",
            role: "ROLE_LABOR_MANAGEMENT_SETTINGS",
          },
          // { name: 'countries', url: '/labor/general/countries', icon: 'fa fa-users', role: 'ROLE_LABOR_MANAGEMENT_SETTINGS' },
          {
            name: "organizational-employee",
            url: "/labor/general/organizational-employee",
            icon: "fa fa-users",
            role: "ROLE_LABOR_MANAGEMENT_SETTINGS",
          },
          {
            name: "login-records",
            url: "/labor/general/login-records",
            icon: "fa fa-users",
            role: "ROLE_LABOR_MANAGEMENT_SETTINGS",
          },
        ],
      },
      {
        name: "labor-skill-matrix",
        icon: "fa fa-hourglass-half",
        url: "/labor/skill-matrix",
        class: "bg-third",
        role: "ROLE_LABOR_MANAGEMENT_SETTINGS",
        children: [
          {
            name: "skill-matrix-sampling-value",
            url: "/labor/skill-matrix/skill-matrix-sampling-value",
            icon: "fa fa-key",
            role: "ROLE_LABOR_MANAGEMENT_SETTINGS",
          },
          {
            name: "skill-matrix-category",
            url: "/labor/skill-matrix/skill-matrix-category",
            icon: "fa fa-exchange",
            role: "ROLE_LABOR_MANAGEMENT_SETTINGS",
          },
          {
            name: "skill-matrix",
            url: "/labor/skill-matrix/skill-matrix",
            icon: "fa fa-key",
            role: "ROLE_LABOR_MANAGEMENT_SETTINGS",
          },

          {
            name: "ergonomics-analysis",
            url: "/labor/skill-matrix/ergonomics-analysis",
            icon: "fa fa-key",
            role: "ROLE_LABOR_MANAGEMENT_SETTINGS",
          },
        ],
      },
    ],
  },
  {
    name: "report-and-analyze-system",
    url: "/analysis",
    icon: "fa fa-line-chart",
    role: "ROLE_REPORT_ANALYZE_SYSTEM",
    children: [
      {
        name: "basic-report-analysis",
        url: "/analysis/basic-report",
        icon: "fa fa-bar-chart",
        class: "bg-third",
        children: [
          {
            name: "job-order-operation-report",
            url: "/analysis/basic-report/job-order-operation-report",
            icon: "fa fa-bar-chart",
            role: "ROLE_REPORT_PRODUCTION_ORDER_VIEW",
          },
          {
            name: "machine-status-analysis",
            url: "/analysis/basic-report/machine-status",
            icon: "fa fa-bar-chart",
            role: "ROLE_REPORT_MACHINE_STATUS_VIEW",
          },
          // { name: 'workstation-analysis', url: '/analysis/basic-report/workstation', icon: 'fa fa-bar-chart', role: 'ROLE_REPORT_WORKSTATION_ANALYSIS_VIEW' },
          {
            name: "stop-analysis",
            url: "/analysis/basic-report/stop-analysis",
            icon: "fa fa-bar-chart",
            class: "bg-fourth",
            role: "ROLE_REPORT_STOP_ANALYSIS_VIEW",
            children: [
              {
                name: "stop-down-times",
                url: "/analysis/basic-report/stop-analysis/stop-down-times",
                icon: "fa fa-bar-chart",
              },
              {
                name: "stop-causes-report",
                url: "/analysis/basic-report/stop-analysis/custom-stop-down-times",
                icon: "fa fa-bar-chart",
              },
            ],
          },
          // { name: 'oee-analysis', url: '/analysis/basic-report/oee-workstaion-analysis', icon: 'fa fa-bar-chart', role: 'ROLE_REPORT_OEE_WORKSTATION_VIEW' },

          // {
          //   name: 'employee-analysis', url: '/analysis/basic-report/employee-analysis', icon: 'fa fa-bar-chart', class: 'bg-fourth', role: 'ROLE_REPORT_EMPLOYEE_ANALYSIS_VIEW',
          //   children: [
          //     { name: 'custom-employee-analysis', url: '/analysis/basic-report/employee-analysis/custom', icon: 'fa fa-bar-chart' },
          //     { name: 'all-employee-analysis', url: '/analysis/basic-report/employee-analysis/all', icon: 'fa fa-bar-chart' },
          //     // { name: 'employee-efficiency', url: '/analysis/basic-report/employee/new', icon: 'fa fa-bar-chart' }
          //   ]
          // },
          {
            name: "ergonomy-analysis-report",
            url: "/analysis/basic-report/ergonomy-analysis-report",
            icon: "fa fa-bar-chart",
            role: "ROLE_REPORT_SCRAP_VIEW",
          },
          {
            name: "scrap-dashboard",
            url: "/analysis/basic-report/scrap-dashboard",
            icon: "fa fa-bar-chart",
            role: "ROLE_REPORT_SCRAP_VIEW",
          },
          {
            name: "rework-dashboard",
            url: "/analysis/basic-report/rework-dashboard",
            icon: "fa fa-bar-chart",
            role: "ROLE_REPORT_SCRAP_VIEW",
          },

          {
            name: "power-consumption",
            url: "/analysis/basic-report/power-consumption",
            icon: "fa fa-bar-chart",
            class: "bg-fourth",
            role: "ROLE_REPORT_POWER_CONSUMPTION_VIEW",
            children: [
              {
                name: "job-order-power-consumption",
                url: "/analysis/basic-report/power-consumption/joborder",
                icon: "fa fa-bar-chart",
              },
              {
                name: "workstation-power-consumption",
                url: "/analysis/basic-report/power-consumption/workstation",
                icon: "fa fa-bar-chart",
              },
              {
                name: "all-workstation-power-consumption",
                url: "/analysis/basic-report/power-consumption/all",
                icon: "fa fa-bar-chart",
              },
            ],
          },
        ],
      },
      {
        name: "advanced-report-analysis",
        url: "/analysis/advanced-report",
        icon: "fa fa-bar-chart",
        class: "bg-third",
        children: [
          {
            name: "dashboard-kpi",
            url: "/analysis/advanced-report/dashboard-kpi",
            icon: "icon-chart",
            role: "ROLE_REPORT_MACHINE_STATUS_DAILY_VIEW",
          },
          {
            name: "production-order-report",
            url: "/analysis/advanced-report/production-order-report",
            icon: "icon-chart",
            role: "ROLE_REPORT_MACHINE_STATUS_DAILY_VIEW",
          },
          {
            name: "machine-status-daily-analysis",
            url: "/analysis/advanced-report/machine-status-daily",
            icon: "fa fa-bar-chart",
            role: "ROLE_REPORT_MACHINE_STATUS_DAILY_VIEW",
          },
          {
            name: "workcenter-analysis",
            url: "/analysis/advanced-report/workcenter-analysis",
            icon: "fa fa-bar-chart",
            role: "ROLE_REPORT_WORKCENTER_ANALYSIS_VIEW",
          },
          {
            name: "allocation-report",
            url: "/analysis/advanced-report/allocation-report",
            icon: "fa fa-bar-chart",
            role: "ROLE_REPORT_OEE_JOB_ORDER_VIEW",
          },
          {
            name: "simulation-report",
            url: "/analysis/advanced-report/simulation-report",
            icon: "fa fa-bar-chart",
            role: "ROLE_REPORT_OEE_JOB_ORDER_VIEW",
          },
          // { name: 'oee-job-order-analysis', url: '/analysis/advanced-report/oee-job-order', icon: 'fa fa-bar-chart', role: 'ROLE_REPORT_OEE_JOB_ORDER_VIEW' },
          {
            name: "oee-job-order-analysis-reporting",
            url: "/analysis/advanced-report/oee-job-order-reporting",
            icon: "fa fa-bar-chart",
            role: "ROLE_REPORT_OEE_JOB_ORDER_VIEW",
          },
          {
            name: "employee-efficiency",
            url: "/analysis/advanced-report/employee-efficiency",
            icon: "fa fa-bar-chart",
          },
          {
            name: "job-order-process-report",
            url: "/analysis/advanced-report/job-order-process-report",
            icon: "fa fa-bar-chart",
            role: "ROLE_REPORT_PRODUCTION_ORDER_VIEW",
          },
        ],
      },
      // { name: 'oee-analysis', url: '/analysis/oee-workstaion-analysis', icon: 'fa fa-bar-chart', role: 'ROLE_REPORT_OEE_WORKSTATION_VIEW' },

      // { name: 'production-order', url: '/analysis/job-order', icon: 'fa fa-bar-chart', role: 'ROLE_REPORT_PRODUCTION_ORDER_VIEW' },
      // { name: 'workstation-anl', url: '/analysis/workstation', icon: 'fa fa-bar-chart', role: 'ROLE_REPORT_WORKSTATION_ANALYSIS_VIEW' },
      // { name: 'workcenter-anl', url: '/analysis/workcenter-analysis', icon: 'fa fa-bar-chart', role: 'ROLE_REPORT_WORKCENTER_ANALYSIS_VIEW' },
      // { name: 'machine-status-anl', url: '/analysis/machine-status', icon: 'fa fa-bar-chart', role: 'ROLE_REPORT_MACHINE_STATUS_VIEW' },
      // { name: 'machine-status-daily-anl', url: '/analysis/machine-status-daily', icon: 'fa fa-bar-chart', role: 'ROLE_REPORT_MACHINE_STATUS_DAILY_VIEW' },
      // {
      //   name: 'stop-downtime-anl', url: '/analysis/stop-downtime', icon: 'fa fa-bar-chart', class: 'bg-third', role: 'ROLE_REPORT_STOP_ANALYSIS_VIEW',
      //   children: [
      //     { name: 'all', url: '/analysis/stop-downtime/all', icon: 'fa fa-bar-chart' },
      //     { name: 'custom', url: '/analysis/stop-downtime/custom', icon: 'fa fa-bar-chart' }
      //   ]
      // },
      // { name: 'oee-anl', url: '/analysis/oee', icon: 'fa fa-bar-chart', role: 'ROLE_REPORT_OEE_WORKSTATION_VIEW' },
      // { name: 'oee-job-order-anl', url: '/analysis/oee-job-order', icon: 'fa fa-bar-chart', role: 'ROLE_REPORT_OEE_JOB_ORDER_VIEW' },
      // { name: 'oee-job-order-anl-reporting', url: '/analysis/oee-job-order-reporting', icon: 'fa fa-bar-chart', role: 'ROLE_REPORT_OEE_JOB_ORDER_VIEW' },
      // {
      //   name: 'employee-anl', url: '/analysis/employee', icon: 'fa fa-bar-chart', class: 'bg-third', role: 'ROLE_REPORT_EMPLOYEE_ANALYSIS_VIEW',
      //   children: [
      //     { name: 'custom', url: '/analysis/employee/custom', icon: 'fa fa-bar-chart' },
      //     { name: 'all', url: '/analysis/employee/all', icon: 'fa fa-bar-chart' },
      //     { name: 'new', url: '/analysis/employee/new', icon: 'fa fa-bar-chart' }
      //   ]
      // },
      // { name: 'scrap', url: '/analysis/scrap', icon: 'fa fa-bar-chart', role: 'ROLE_REPORT_SCRAP_VIEW' },
      // {
      //   name: 'power-consumption', url: '/analysis/power-consumption', icon: 'fa fa-bar-chart', class: 'bg-third', role: 'ROLE_REPORT_POWER_CONSUMPTION_VIEW',
      //   children: [
      //     { name: 'job-order', url: '/analysis/power-consumption/joborder', icon: 'fa fa-bar-chart' },
      //     { name: 'workstation', url: '/analysis/power-consumption/workstation', icon: 'fa fa-bar-chart' },
      //     { name: 'all', url: '/analysis/power-consumption/all', icon: 'fa fa-bar-chart' }
      //   ]
      // },
    ],
  },

  {
    name: "settings",
    url: "/settings",
    icon: "fa fa-industry",
    role: "ROLE_SETTINGS",
    children: [
      {
        name: "general-settings",
        url: "/settings/general-settings",
        icon: "fa fa-industry",
        role: "ROLE_GENERAL_SETTINGS",
        class: "bg-third",
        children: [
          {
            name: "company",
            url: "/settings/general-settings/company",
            icon: "fa fa-address-card",
            role: "ROLE_GENERAL_SETTINGS",
          },
          {
            name: "plants",
            url: "/settings/general-settings/plants",
            icon: "fa fa-gear",
            role: "ROLE_GENERAL_SETTINGS",
          },
          {
            name: "organizations",
            url: "/settings/general-settings/organizations",
            icon: "fa fa-gear",
            role: "ROLE_GENERAL_SETTINGS",
          },
          {
            name: "factory-calendar",
            url: "/settings/general-settings/factory/calendar",
            icon: "icon-chart",
            role: "ROLE_GENERAL_SETTINGS",
          },
          {
            name: "workcenter-calendar",
            url: "/settings/general-settings/workcenter-calendar",
            icon: "icon-chart",
            role: "ROLE_GENERAL_SETTINGS",
          },
          {
            name: "alert-message",
            url: "/settings/general-settings/alert-message",
            icon: "fa fa-warning",
            role: "ROLE_GENERAL_SETTINGS",
          },
          {
            name: "cities",
            url: "/settings/general-settings/cities",
            icon: "fa fa-users",
            role: "ROLE_GENERAL_SETTINGS",
          },
          {
            name: "countries",
            url: "/settings/general-settings/countries",
            icon: "fa fa-users",
            role: "ROLE_GENERAL_SETTINGS",
          },
          {
            name: "measuring-unit",
            url: "/settings/general-settings/measuring-unit",
            icon: "fa fa-bolt",
            role: "ROLE_MAINTENANCE_SETTINGS",
          },
          {
            name: "print",
            url: "/settings/general-settings/print",
            icon: "fa fa-gear",
            role: "ROLE_GENERAL_SETTINGS",
            class: "bg-fourth",
            children: [
              // { name: 'common-template-types', url: '/settings/general-settings/print/commontemplatetypes', icon: 'fa fa-gear', role: 'ROLE_GENERAL_SETTINGS' },
              {
                name: "common-templates",
                url: "/settings/general-settings/print/commontemplates",
                icon: "fa fa-gear",
                role: "ROLE_GENERAL_SETTINGS",
              },
            ],
          },
          {
            name: "preferences",
            url: "/settings/general-settings/preferences",
            icon: "fa fa-industry",
            role: "ROLE_GENERAL_SETTINGS",
          },
        ],
      },
      {
        name: "production",
        url: "/settings/production",
        icon: "fa fa-industry",
        role: "ROLE_PRODUCTION_SETTINGS",
        class: "bg-third",
        children: [
          {
            name: "warehouse-settings",
            url: "/settings/production/warehouse-settings",
            icon: "fa fa-industry",
            role: "ROLE_PRODUCTION_SETTINGS",
            class: "bg-fourth",
            children: [
              {
                name: "warehouses",
                url: "/settings/production/warehouse-settings/wareHouses",
                icon: "fa fa-database",
                role: "ROLE_WAREHOUSE_SETTINGS",
              },
              {
                name: "warehouse-locations",
                url: "/settings/production/warehouse-settings/warehouse-locations",
                icon: "fa fa-database",
                role: "ROLE_WAREHOUSE_SETTINGS",
              },
              {
                name: "pallets",
                url: "/settings/production/warehouse-settings/pallets",
                icon: "fa fa-database",
                role: "ROLE_WAREHOUSE_SETTINGS",
              },
            ],
          },
          {
            name: "workcenter-settings",
            url: "/settings/production/workcenter-settings",
            icon: "fa fa-industry",
            role: "ROLE_PRODUCTION_SETTINGS",
            class: "bg-fourth",
            children: [
              {
                name: "workcenters",
                url: "/settings/production/workcenter-settings/workcenter",
                icon: "fa fa-cloud",
                role: "ROLE_PRODUCTION_SETTINGS",
              },
              {
                name: "workcenter-types",
                url: "/settings/production/workcenter-settings/workcenter-types",
                icon: "fa fa-cloud",
                role: "ROLE_PRODUCTION_SETTINGS",
              },
            ],
          },
          {
            name: "workstation-settings",
            url: "/settings/production/workstation-settings",
            icon: "fa fa-industry",
            role: "ROLE_PRODUCTION_SETTINGS",
            class: "bg-fourth",
            children: [
              {
                name: "workstations",
                url: "/settings/production/workstation-settings/workstation",
                icon: "fa fa-desktop",
                role: "ROLE_PRODUCTION_SETTINGS",
              },
              {
                name: "workstation-types",
                url: "/settings/production/workstation-settings/workstation-types",
                icon: "fa fa-desktop",
                role: "ROLE_PRODUCTION_SETTINGS",
              },
              {
                name: "workstation-categories",
                url: "/settings/production/workstation-settings/workstation-categories",
                icon: "fa fa-desktop",
                role: "ROLE_PRODUCTION_SETTINGS",
              },
              {
                name: "workstation-program",
                url: "/settings/production/workstation-settings/workstation-programs",
                icon: "fa fa-desktop",
                role: "ROLE_PRODUCTION_SETTINGS",
              },
            ],
          },
          {
            name: "operation-settings",
            url: "/settings/production/operation-settings",
            icon: "fa fa-industry",
            role: "ROLE_PRODUCTION_SETTINGS",
            class: "bg-fourth",
            children: [
              {
                name: "operations",
                url: "/settings/production/operation-settings/operations",
                icon: "fa fa-gear",
                role: "ROLE_PRODUCTION_SETTINGS",
              },
              {
                name: "operation-type",
                url: "/settings/production/operation-settings/operation-type",
                icon: "fa fa-gear",
                role: "ROLE_PRODUCTION_SETTINGS",
              },
              {
                name: "operation-type-to-ws-type",
                url: "/settings/production/operation-settings/operation-type-to-ws-type",
                icon: "fa fa-desktop",
                role: "ROLE_PRODUCTION_SETTINGS",
              },
            ],
          },

          {
            name: "stop-settings",
            url: "/settings/production/stop-settings",
            icon: "fa fa-industry",
            role: "ROLE_PRODUCTION_SETTINGS",
            class: "bg-fourth",
            children: [
              {
                name: "stop-cause-type",
                url: "/settings/production/stop-settings/stop-cause-type",
                icon: "fa fa-gear",
                role: "ROLE_PRODUCTION_SETTINGS",
              },
              {
                name: "stop-causes",
                url: "/settings/production/stop-settings/causes",
                icon: "fa fa-gear",
                role: "ROLE_PRODUCTION_SETTINGS",
              },
            ],
          },
          {
            name: "material-settings",
            url: "/settings/production/material-settings",
            icon: "fa fa-industry",
            role: "ROLE_PRODUCTION_SETTINGS",
            class: "bg-fourth",
            children: [
              {
                name: "material-types",
                url: "/settings/production/material-settings/material-types",
                icon: "fa fa-gear",
                role: "ROLE_PRODUCTION_SETTINGS",
              },
              {
                name: "material-group",
                url: "/settings/production/material-settings/material-group",
                icon: "fa fa-gear",
                role: "ROLE_PRODUCTION_SETTINGS",
              },
              {
                name: "industry",
                url: "/settings/production/material-settings/industry",
                icon: "fa fa-gear",
                role: "ROLE_PRODUCTION_SETTINGS",
              },
            ],
          },
          {
            name: "vehicle",
            url: "/settings/production/forklift",
            icon: "fa fa-industry",
            role: "ROLE_PRODUCTION_SETTINGS",
            class: "bg-fourth",
          },
          {
            name: "location",
            url: "/settings/production/location",
            icon: "fa fa-industry",
            role: "ROLE_PRODUCTION_SETTINGS",
            class: "bg-fourth",
          },
        ],
      },
      {
        name: "cost",
        url: "/settings/cost",
        icon: "fa fa-industry",
        role: "ROLE_PRODUCTION_SETTINGS",
        class: "bg-third",
        children: [
          {
            name: "exchange-rates",
            url: "/settings/cost/exchange-rates",
            icon: "fa fa-money",
            role: "ROLE_SALE_ORDER_VIEW",
          },
          {
            name: "cost-centers",
            url: "/settings/cost/cost-centers",
            icon: "fa fa-money",
            role: "ROLE_SALE_ORDER_VIEW",
          },
          {
            name: "parities",
            url: "/settings/cost/parities",
            icon: "fa fa-gear",
            role: "ROLE_SALE_ORDER_VIEW",
          },
        ],
      },
      {
        name: "maintenance",
        url: "/settings/maintenance",
        icon: "fa fa-industry",
        role: "ROLE_MAINTENANCE_SETTINGS",
        class: "bg-fourth",
        children: [
          {
            name: "power-consumption",
            url: "/settings/maintenance/power-consuption",
            icon: "fa fa-bolt",
            role: "ROLE_MAINTENANCE_SETTINGS",
          },
        ],
      },
    ],
  },
  {
    name: "logout",
    url: "/login",
    icon: "fa fa-power-off",
    class: "mt-auto",
    variant: "danger",
  },
];
