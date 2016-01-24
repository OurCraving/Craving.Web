/*
NOTE: this build script is using Browserify, which doesn't allow to access javascript in another module
A module is defined when using "require". So if we have a require("_common.js") which defines a bunch helper functions, any other modules
cannot call those things, unless those functions are attached to "window" 
http://stackoverflow.com/questions/23296094/browserify-how-to-call-function-bundled-in-a-file-generated-through-browserify

for the same reason, a different angular module cannot be found (I can't explain, but it must be the same reason)

To get away from this limitation, we will need to define UMD (universal module definition) in the configuration 
http://dontkry.com/posts/code/browserify-and-the-universal-module-definition.html

however, TLDR 

therefore, I just have:
- 1 angular module 
- window.helper property 
*/

// map
require('./maps/main');

// core
require('./core/app.js');
require('./core/config.router.js');
require('./core/main.js');
require('./_appHelper');
require('./_mapHelper');

// services
require('./services/service.module.js');
require('./services/authService.js');
require('./services/referenceDataService.js');
require('./services/geoService.js');
require('./services/cravingService.js');
require('./services/restaurantService.js');
require('./services/dinerService.js');
require('./services/loggerService.js');
require('./services/navigationService.js');
require('./services/factualService.js');
require('./services/modalService.js');
require('./services/recentDishService.js');
require('./services/proposalService.js');
require('./services/loaderFactory.js');
require('./services/resumeService.js');
require('./services/adminService.js');

// layout related
require('./layout/navbar.location.js');

// account 
require('./account/account.js');
require('./account/account.login.js');
require('./account/account.signup.js');
require('./account/profile.js');
require('./account/profile.basic.js');
require('./account/profile.dislikecravings.js');
require('./account/profile.updatepassword.js');

// craving
require('./craving/craving.tags.js');
require('./craving/craving.search.js');
require('./craving/craving.recent.js');

// dish 
require('./dish/dish.mapEdit.js');
require('./dish/dish.fieldEdit.js');
require('./dish/dish.detail.js');
require('./dish/restaurant.map.js');
require('./dish/dish.recent.js');
require('./dish/image.modal.js');
require('./dish/dish.addImage.js');
require('./dish/dish.addTags.js');

// diner 
require('./users/diner.detail.js');

//proposal
require('./proposal/proposal.my.js');
require('./proposal/proposal.view.js');
require('./proposal/proposal.modal.js');

// admin
require('./admin/admin.js');
require('./admin/admin.dishes.js');
require('./admin/admin.reviews.js');
require('./admin/admin.files.js');
require('./admin/admin.users.js');


// Directives
require('./widgets/cravingSelect.js');
require('./widgets/onLastRepeat.js');
require('./widgets/ngConfirmClick.js');
require('./widgets/access.js');

