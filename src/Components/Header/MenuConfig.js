export const menuItems = [
    {
      title: "Dashboard",
      root: true,
      icon: "Dashboard-icon.svg",
      page: "/dashboard",
      translate: "MENU.Dashboard",
      isubmenu: "0",
      iscountrequired: "0",
      type: ["Requester", "Security", "Approver", "SecurityAdmin", "SecurityOfficer"],
      subpage: [""],
    },
    {
      title: "My Application",
      root: true,
      icon: "My-appliction-icon.svg",
      page: "/",
      translate: "MENU.Myapplication",
      isubmenu: "1",
      iscountrequired: "1",
      type: ["Requester", "Security", "Approver", "SecurityAdmin", "SecurityOfficer"],
      subpage: ["/draft/list","/revision/list","/pending/list","/approved/list","/rejected/list","/cancelled/list","/pendinggoodsreturn/list","/Pendingconfirmgoodsreturn/list","/securitycancelled/list"],
      submenu: [
        {
          title: "Draft",
          icon: "draft.svg",
          translate: "MENU.draft",
          page: "/draft/list",
          type: ["Requester"]
        },
        {
          title: "Revision",
          icon: "revision.svg",
          translate: "MENU.revision",
          page: "/revision/list",
          type: ["Requester"]
        },
        {
          title: "Pending",
          icon: "pendig-icon.svg",
          translate: "MENU.pending",
          page: "/pending/list",
          type: ["Requester"]
        },
        {
          title: "Approved",
          icon: "approvrd.svg",
          translate: "MENU.approved",
          page: "/approved/list",
          type: ["Requester"]
        },
        {
          title: "Rejected",
          icon: "rejected.svg",
          translate: "MENU.rejected",
          page: "/rejected/list",
          type: ["Requester"]
        },
        {
          title: "Cancelled",
          icon: "cancelled.svg",
          translate: "MENU.cancelled",
          page: "/cancelled/list",
          type: ["Requester"]
        },
        {
          title: "Pending Goods Return",
          icon: "pending-goods-return.svg",
          translate: "MENU.pending_goods_return",
          page: "/pendinggoodsreturn/list",
          type: ["Requester"]
        },
        {
          title: "Pending Confirm Goods return",
          icon: "pending-goods-confirm-return.svg",
          translate: "MENU.Pending_confirm_goods_return",
          page: "/Pendingconfirmgoodsreturn/list",
          type: ["Requester"]
        }        
      ]
    },
    {
      title: "Security Corner",
      root: true,
      icon: "approvrd.svg",
      page: "/",
      translate: "MENU.Security.Corner",
      isubmenu: "1",
      iscountrequired: "0",
      type: ["Security", "SecurityAdmin"],
      subpage: ["/typeofgoods/typeofgoodsList","/exitentry/update"],
      submenu: [
        {
          title: "Type of Goods",
          icon: "draft.svg",
          translate: "MENU.Type.of.Goods",
          page: "/typeofgoods/typeofgoodsList",
          type: ["Requester"]
        },
        {
          title: "GGP Exit & Entry update",
          icon: "draft.svg",
          translate: "MENU.GGP.Exit.Entry.update",
          page: "/exitentry/update",
          type: ["Requester"]
        }
      ]
    },
    {
      title: "Security Corner",
      root: true,
      icon: "approvrd.svg",
      page: "/",
      translate: "MENU.Security.Corner",
      isubmenu: "1",
      iscountrequired: "0",
      type: ["Security", "SecurityOfficer"],
      subpage: ["/exitentry/update"],
      submenu: [
        {
          title: "GGP Exit & Entry update",
          icon: "draft.svg",
          translate: "MENU.GGP.Exit.Entry.update",
          page: "/exitentry/update",
          type: ["Requester"]
        }
      ]
    },
    {
      title: "My Task",
      root: true,
      icon: "approvrd.svg",
      page: "/",
      translate: "MENU.MyTask",
      isubmenu: "1",
      iscountrequired: "1",
      type: ["Approver"],
      subpage: ["/mytask/approved/list", "/mytask/approved/view", "/mytask/approved/workflow","/mytask/pending/list","/mytask/pending/view","/mytask/pending/workflow","/mytask/rejected/list","/mytask/rejected/view","/mytask/rejected/workflow"],
      submenu: [
        {
          title: "Pending",
          icon: "draft.svg",
          translate: "MENU.MyTask_Pending",
          page: "/mytask/pending/list",
          type: ["Approver"]
        },
        {
          title: "Approved",
          icon: "draft.svg",
          translate: "MENU.MyTask_Approved",
          page: "/mytask/approved/list",
          type: ["Approver"]
        },
        {
          title: "Rejected",
          icon: "draft.svg",
          translate: "MENU.MyTask_Rejected",
          page: "/mytask/rejected/list",
          type: ["Approver"]
        }
      ]
    },
    {
      title: "Reports",
      root: true,
      icon: "Reports.svg",
      page: "/",
      translate: "MENU.Reports",
      isubmenu: "1",
      iscountrequired: "0",
      type: ["Requester", "Security", "Approver", "SecurityAdmin", "SecurityOfficer"],
      subpage: ["/exitentry/list", "/report/list"],
      submenu: [
        {
          title: "GGP Report",
          icon: "draft.svg",
          translate: "MENU.GGPReport",
          page: "/report/list",
          type: ["Requester"]
        },
        {
          title: "GGP History",
          icon: "draft.svg",
          translate: "MENU.GGPHistory",
          page: "/exitentry/list",
          type: ["Requester"]
        }
      ]
    },
    {
      title: "Old GGP link",
      root: true,
      icon: "old-website.svg",
      page: "http://webapps.mmhe.com.my/eggp/_layouts/15/eGGP/Dashboard.aspx",
      translate: "MENU.OldDashboard",
      isubmenu: "0",
      iscountrequired: "0",
      type: ["Requester", "Security", "Approver", "SecurityAdmin", "SecurityOfficer"],
      subpage: [""],
    }
  ];