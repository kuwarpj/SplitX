

const Routes = {
  SEND_OPT: "/auth/sendotp",
  VERIFY_OPT: "/auth/verify-and-signup",
  LOGIN: "/auth/login",
  LOGOUT :'/auth/logout',

  //Groups API
  GET_USER_GROUP: "/api/groups/usergroup",
  CREATE_GROUP: "/api/groups/create",
  GET_GROUP_BY_ID : '/api/groups',
  GET_USER_GROUP_SUMMARY: (groupId: string) => `/api/groups/user-balance/${groupId}`,


  GET_GROUP_EXPENSE : '/api/expenses/group/',
  ADD_EXPENSE : '/api/expenses/add',
  GET_RECENT_ACTIVITY : '/api/groups/user/recent-activity',
  UPDATE_EXPENSE : '/api/expenses/edit',
  DASHBOARD_SUMMARY: '/api/users/userDetails',
  GET_NOTIFICATIONS: '/api/invite/getallinvite',
  ACCEPT_INVITATION: (id: string) => `/api/invite/accept/${id}`,

};

export default Routes;
