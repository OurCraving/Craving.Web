// this is an extra external module 
require('./widgets/ngplus-overlay.js');

// core
require('./core/app.js');
require('./core/app.constant.js');
require('./core/main.js');
require('./core/config.router.account.js');
require('./core/config.router.admin.js');
require('./core/config.router.dish.js');
require('./core/config.router.js');
require('./_appHelper.js');
require('./_mapHelper.js');

// layout
require('./layout/header.js');
require('./layout/header.commands.js');
require('./layout/search.bar.js'); // TODO: to be merged back to header
require('./layout/navbar.location.js');

// system
require('./sys/location.js');

// account
require('./account/account.js');
require('./account/account.login.js');
require('./account/account.signup.js');
require('./account/account.reset.js');
require('./account/account.activate.js');
require('./account/profile.js');
require('./account/profile.associate.js');
require('./account/profile.basic.js');
require('./account/profile.dislikecravings.js');
require('./account/profile.updatepassword.js');
require('./account/profile.cravinghistory.js');
require('./account/profile.favorite.js');
require('./account/profile.mydish.js');
require('./account/profile.myreview.js');
require('./account/profile.settings.js');

// cravings
require('./craving/craving.tags.js');
require('./craving/craving.search.js');

// admin
require('./admin/admin.js');
require('./admin/admin.dishes.js');
require('./admin/admin.reviews.js');
require('./admin/admin.users.js');
require('./admin/admin.files.js');
require('./admin/admin.cravingtags.js');
require('./admin/admin.cache.js');
require('./admin/admin.moderation.modal.js');

// dish
require('./dish/dish.add.js');
require('./dish/map.add.js');
require('./dish/map.viewer.js');
require('./dish/dish.detail.js');
require('./dish/dish.addImage.js');
require('./dish/dish.addTags.js');
require('./dish/image.modal.js');
require('./dish/dish.recent.js');

//proposal
require('./proposal/proposal.my.js');
require('./proposal/proposal.view.js');
require('./proposal/proposal.modal.js');

//restaurant
require('./restaurant/restaurant.js');
require('./restaurant/singleRandomRestaurant.js');

// diner 
require('./user/diner.detail.js'); // the opening logic is different 

// widgets
require('../ourcraving/widgets/onLastRepeat.js');
require('../ourcraving/widgets/ngConfirmClick.js');
require('../ourcraving/widgets/access.js');
require('../ourcraving/widgets/cravingSelect.js');
require('./widgets/compareTo.js'); // NEW for ng-message 
require('./widgets/dishDuplicationCheck.js');
require('./widgets/dirDisqus.js'); 
require('./widgets/fileField.js'); 

// services
require('../ourcraving/services/service.module.js');
require('../ourcraving/services/authService.js');
require('../ourcraving/services/referenceDataService.js');
require('../ourcraving/services/geoService.js');
require('../ourcraving/services/cravingService.js');
require('../ourcraving/services/restaurantService.js');
require('../ourcraving/services/dinerService.js');

require('./services/loggerService.js'); // NEW! coz we are using a different toast msg handler
require('./services/modalService.js'); // NEW! using MD dialog
require('./services/fileService.js');

require('../ourcraving/services/navigationService.js');
require('../ourcraving/services/factualService.js');
require('../ourcraving/services/recentDishService.js');
require('../ourcraving/services/proposalService.js');
require('../ourcraving/services/loaderFactory.js');
require('../ourcraving/services/resumeService.js');
require('../ourcraving/services/adminService.js');