app
    .controller('RolesList', ['$scope', 'getSource', '$filter', function($scope, getSource, $filter) {
        var parentModule = [];
        var childModule = [];
        var selectedRole = null;
        var rolesModule = [];
        $scope.createGroup = function(item) {
            var group = { name: 'New Role' };
            var updateRoles = function(data) {
                if (data.code == 1) {
                    $scope.groups.push({ id: data.id, name: group.name });
                }
            };
            var data = {
                name: group.name
            };
            var tips = "角色 [ " + group.name + " ] 添加成功！";
            getSource.source('/home/role/update', 'POST', data, updateRoles, tips);
        };

        $scope.deleteGroup = function(item) {
            var deleteRoles = function(data) {
                $scope.groups.splice($scope.groups.indexOf(item), 1);
            };
            var data = {
                id: item.id
            };
            var tips = "角色 [ " + item.name + " ] 删除成功！";
            getSource.source('/home/role/delete', 'POST', data, deleteRoles, tips);
        };

        $scope.selectGroup = function(item) {
            selectedRole = item.id;
            angular.forEach($scope.groups, function(item) {
                item.selected = false;
            });
            $scope.group = item;
            $scope.group.selected = true;
            $scope.filter = item.name;
            var modulsList = item.moduls ? item.moduls.split(",") : [];
            var newList = $scope.moduleInit;
            var roleid = item.id;
            for (var item in newList) {
                for (var child in newList[item].children) {
                    if (modulsList.indexOf(newList[item].children[child].id.toString()) >= 0) {
                        newList[item].children[child].checked = true;
                        newList[item].children[child].roleid = roleid;
                        newList[item].children[child].oldmoduls = modulsList;
                    } else {
                        newList[item].children[child].checked = false;
                        newList[item].children[child].roleid = roleid;
                        newList[item].children[child].oldmoduls = modulsList;
                    }
                }
            }
            $scope.moduleInit = newList;
        };
        $scope.createItem = function() {
            var item = {
                group: 'Friends',
                avatar: 'img/a0.jpg'
            };
            $scope.items.push(item);
            $scope.selectItem(item);
            $scope.item.editing = true;
        };

        $scope.editItem = function(item) {
            if (item && item.selected) {
                item.editing = true;
            }
        };
        $scope.save = function() {
            rolesModule = [];
            for (var item in $scope.moduleInit) {
                for (var child in $scope.moduleInit[item].children)
                    if ($scope.moduleInit[item].children[child].checked) {
                        rolesModule.push($scope.moduleInit[item].children[child].id)
                    }
            }
            rolesModule = rolesModule.join(",")
            var moduleRelevance = function(data) {};
            var data = {
                id: selectedRole,
                modules: rolesModule
            };
            var tips = "模块关联成功！";
            getSource.source('/home/role/modules', 'POST', data, moduleRelevance, tips);
        }
        $scope.doneEditing = function(item) {
            item.editing = false;
            var updateRoles = function(data) {
                if (data.code == 1) {
                    item.id = data.id;
                }
            };
            var data = {
                id: item.id,
                name: item.name,
                sort: item.sort
            };
            var tips = "角色 [ " + item.name + " ] 更新成功！";
            getSource.source('/home/role/update', 'POST', data, updateRoles, tips);
        };
        var getRolesList = function(data) {
            var moduleStruct = {};
            for (var module in data.modules) {
                if (data.modules[module].parent == 0) {
                    if (!moduleStruct['_' + data.modules[module].id].children) {
                        moduleStruct['_' + data.modules[module].id] = { children: [] };
                    }
                    moduleStruct['_' + data.modules[module].id].name = data.modules[module].name;
                    moduleStruct['_' + data.modules[module].id].id = data.modules[module].id;
                }
                if (!moduleStruct['_' + data.modules[module].parent] && data.modules[module].parent !== 0) {
                    moduleStruct['_' + data.modules[module].parent] = { children: [] };
                }
                if (moduleStruct['_' + data.modules[module].parent]) {
                    moduleStruct['_' + data.modules[module].parent].children.push(data.modules[module]);
                }
            }
            var modulsList = data.roles[0].moduls ? data.roles[0].moduls.split(",") : [];
            var moduleList = moduleStruct;
            data.roles[0].selected = true;
            for (var item in moduleList) {
                for (var child in moduleList[item].children) {
                    if (modulsList.indexOf(moduleList[item].children[child].id.toString()) >= 0) {
                        moduleList[item].children[child].checked = true;
                    } else {
                        moduleList[item].children[child].checked = false;
                    }
                }
            }
            $scope.moduleInit = moduleList;
            $scope.groups = data.roles;
        }
        var data = {}
        getSource.source('/home/role/list', 'POST', data, getRolesList);
    }]);
