app
    .controller('Create', ['$scope', '$modal', '$log', function($scope, $modal, $log) {
        $scope.NewUser = function(roles, size) {
            // console.log(roles)
            var modalInstance = $modal.open({
                templateUrl: 'editContent',
                controller: 'CreateModel',
                size: size,
                resolve: {
                    rolesObj: function() {
                        return roles;
                    }
                }
            });
        };
    }])

.controller('CreateModel', ['$scope', '$modalInstance', 'getSource', 'rolesObj', function($scope, $modalInstance, getSource, rolesObj) {
        $scope.modelName = "新建用户";
        $scope.unameStatus = false;
        $scope.data = {};
        $scope.roles = rolesObj;
        $scope.save = function() {
            var userName = $scope.data.username,
                userPasswd = $scope.data.password,
                userPhone = $scope.data.phone,
                userEmail = $scope.data.email,
                userSex = $scope.data.sex,
                userRealname = $scope.data.realname,
                userNickname = $scope.data.nickName,
                userWebsite = $scope.data.website,
                userAddress = $scope.data.address,
                userProfile = $scope.data.profile,
                userRoles = []

            for (var item in $scope.roles) {
                if ($scope.roles[item][2]) {
                    userRoles.push($scope.roles[item][0])
                }
            }
            // console.log($scope.roles)
            userRoles = userRoles.join(",");
            // console.log(userRoles)
            // return;
            var updateUser = function(data) {
                if (data.code == 1) {
                    $modalInstance.close();
                }
            }
            var data = {
                username: userName,
                password: userPasswd,
                phone: userPhone,
                email: userEmail,
                sex: userSex,
                realname: userRealname,
                nickName: userNickname,
                website: userWebsite,
                address: userAddress,
                profile: userProfile,
                roles: userRoles
            };
            var tips = "用户 [ " + userName + " ] 成功！"
            getSource.source('/home/user/update', 'POST', data, updateUser, tips);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }])
    //edit model
    .controller('Edit', ['$scope', '$modal', '$log', function($scope, $modal, $log) {
        $scope.open = function(list, data, size) {
            // console.log(data)
            data.roles = data.roles.split(",");
            for (var item in list) {
                if (data.roles.indexOf(list[item][0].toString()) >= 0) {
                    list[item].push(true)
                }
            }
            data.roles = list;
            var modalInstance = $modal.open({
                templateUrl: 'editContent',
                controller: 'EditModel',
                size: size,
                resolve: {
                    userObj: function() {
                        return data;
                    }
                }
            });
        };
    }])

.controller('EditModel', ['$scope', '$modalInstance', 'getSource', 'userObj', function($scope, $modalInstance, getSource, userObj) {
        $scope.modelName = "修改用户信息";
        $scope.unameStatus = true;
        $scope.data = userObj;
        console.log(userObj.sex == 0)
        $scope.roles = userObj.roles;
        $scope.save = function() {
            var userId = $scope.data.id,
                userPasswd = $scope.data.password || "",
                userPhone = $scope.data.phone,
                userSex = $scope.data.sex,
                userEmail = $scope.data.email,
                userRealname = $scope.data.realname,
                userNickname = $scope.data.nickName,
                userWebsite = $scope.data.website,
                userAddress = $scope.data.address,
                userProfile = $scope.data.profile,
                userRoles = [];
            // console.log(userId, userPasswd, userPhone, userSex, userEmail, userRealname, userNickname, userWebsite, userAddress, userProfile, userRoles)
            console.log($scope.data.sex)
                // return false;
            console.log($scope.data.roles)
            for (var item in $scope.data.roles) {
                if ($scope.data.roles[item][2]) {
                    userRoles.push($scope.data.roles[item][0])
                }
            }
            userRoles = userRoles.join(",");
            // console.log(userRoles)
            // return false;
            var updateUser = function(data) {
                if (data.code == 1) {
                    $modalInstance.close();
                }
            }
            var data = {
                id: userId,
                password: userPasswd,
                phone: userPhone,
                email: userEmail,
                sex: userSex,
                realname: userRealname,
                nickName: userNickname,
                website: userWebsite,
                address: userAddress,
                profile: userProfile,
                roles: userRoles
            };
            var tips = "用户 [ " + $scope.data.username + " ] 信息修改成功！";
            getSource.source('/home/user/update', 'POST', data, updateUser, tips);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    }])
    .controller('Delete', ['$scope', '$modal', '$log', function($scope, $modal, $log) {
        $scope.open = function(data) {
            var modalInstance = $modal.open({
                templateUrl: 'delContent',
                controller: 'DeleteModel',
                resolve: {
                    data: function() {
                        return data;
                    }
                }
            });
        };
    }])

.controller('DeleteModel', ['$scope', '$modalInstance', 'getSource', 'data', function($scope, $modalInstance, getSource, data) {
    $scope.username = data.username;
    var secData = data;
    var userId = secData.id;
    // $scope.$emit('refList', "refLists");
    $scope.ok = function() {
        var deleteUser = function(data) {
            // if (data.code == 1) {
            // console.log($scope.list)
            // $scope.list = null;
            // var func = function() {};
            $modalInstance.close();
            // }
        }
        var data = {
            id: userId,
            status: 2
        };
        var tips = "用户 [ " + $scope.username + " ] 已删除！"
        getSource.source('/home/user/status', 'POST', data, deleteUser, tips);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
}])

.controller('UserList', ['$scope', 'getSource', function($scope, getSource) {
    var isForbidden = 0;
    // $scope.$on('refList', function(data) { console.log(data) });
    $scope.search = function() {
        console.log($scope.UserStatus)
            // return;
        var data = { search: {} };
        var uid = $scope.uid;
        var username = $scope.username;
        var email = $scope.email;
        if (uid) {
            data.search.uid = uid;
        }
        if (username) {
            data.search.username = username;
        }
        if (email) {
            data.search.email = email;
        }
        data.search.status = $scope.UserStatus;
        data.pageSize = 10;
        data.page = 1;
        // $scope.TotalItems = data.result.totalPage * 10;
        data.search = JSON.stringify(data.search)
        var searchUser = function(data) {
            $scope.maxSize = 4;
            $scope.TotalItems = data.result.totalPage * 10;
            $scope.CurrentPage = 1;
            $scope.list = data.result.users;
            $scope.roles = data.result.roles;
            $scope.list = data.result.users;
            console.log($scope.list)
            console.log(data.result.users)
                // console.log($scope.list)
        }
        getSource.source('/home/user/list', 'POST', data, searchUser);
    };
    $scope.change = function(val) {
        var getPageList = function(data) {
            // if (data.code == 1) {
                $scope.list = data.result.users;
            // }
        }
        var pageData = {
            page: val,
            pageSize: 10
        };
        getSource.source('/home/user/list', 'POST', pageData, getPageList);
    }
    $scope.status = function(event, id, uname) {
        console.log(event, id, uname)
        var statusTip = '已禁用';
        isForbidden = event.target.checked ? 0 : 1;
        if (isForbidden == 0) {
            statusTip = '已激活'
        }
        var data = {
            id: id,
            status: isForbidden
        }
        var tips = "用户 [ " + uname + " ] " + statusTip + "！"
        getSource.source('/home/user/status', 'POST', data, function() {}, tips);
    }
    var getList = function() {
        var getList = function(data) {
            $scope.maxSize = 4;
            $scope.TotalItems = data.result.totalPage * 10;
            $scope.CurrentPage = 1;
            $scope.list = data.result.users;
            // console.log(data.result.roles)
            $scope.roles = data.result.roles;
        }
        var data = {
            page: 1,
            pageSize: 10
        }
        getSource.source('/home/user/list', 'POST', data, getList);
    }
    getList();
}]);
