app.controller('ModulsList', function($scope, $timeout, getSource) {
    var apple_selected, tree, treedata_avm, treedata_geography;
    $scope.my_tree_handler = function(branch) {
        $scope.currentSelect = tree.get_selected_branch();
    };
    $scope.new_module = function() {
        console.log($scope.currentSelect)
        var newModule,
            moduleName = 'NewModule';
        newModule = tree.get_selected_branch();
        var addNewModule = function(data) {
            return tree.add_branch(newModule, {
                name: moduleName,
                id: data.id,
                parent: $scope.currentSelect.id
            });
        }
        var data = {
            name: moduleName,
            display: 0,
            parent: $scope.currentSelect.id,
            url: '',
            sort: 0,
            status: 0
        }
        var tips = '添加模块成功！';
        getSource.source('/home/module/update', 'POST', data, addNewModule, tips);

    }
    $scope.del_module = function() {
        var delModule = function(data) {
                console.log(data)
                console.log($scope.currentSelect)
                console.log($scope.my_data)
                for (var item in $scope.my_data) {
                    if ($scope.currentSelect.parent == $scope.my_data[item].id) {
                        console.log(true)
                        for (var delItem in $scope.my_data[item].children) {
                            console.log("delItem")
                            console.log(delItem)
                            if ($scope.my_data[item].children[delItem].id == $scope.currentSelect.id) {

                                $scope.my_data[item].children.splice(delItem, 1)
                            }
                        }
                    }
                }
                // console.log($scope.my_data)
            }
            // return false;
        var data = {
            id: $scope.currentSelect.id
        }
        var tips = '删除模块成功！';
        getSource.source('/home/module/delete', 'POST', data, delModule, tips);

    }
    $scope.mod_module = function() {
        var changName = function(data) {}
        var data = {
            id: $scope.currentSelect.id,
            name: $scope.currentSelect.name,
            display: $scope.currentSelect.display,
            parent: $scope.currentSelect.parent,
            url: $scope.currentSelect.url,
            sort: $scope.currentSelect.sort,
            status: $scope.currentSelect.status
        }
        var tips = '修改模块信息成功！';
        getSource.source('/home/module/update', 'POST', data, changName, tips);
    }

    $scope.my_tree = tree = {};
    $scope.try_adding_a_branch = function() {

    };
    var getModulsList = function(data) {
        var moduleStruct = {};
        var MyData = [];
        for (var module in data.result) {
            if (data.result[module].parent == 0) {
                if (!moduleStruct['_' + data.result[module].id].children) {
                    moduleStruct['_' + data.result[module].id] = { children: [] };
                }
                moduleStruct['_' + data.result[module].id].name = data.result[module].name;
                moduleStruct['_' + data.result[module].id].id = data.result[module].id;
                moduleStruct['_' + data.result[module].id].display = data.result[module].display;
            }
            if (!moduleStruct['_' + data.result[module].parent] && data.result[module].parent !== 0) {
                moduleStruct['_' + data.result[module].parent] = { children: [] };
            }
            if (moduleStruct['_' + data.result[module].parent]) {
                moduleStruct['_' + data.result[module].parent].children.push(data.result[module]);
            }
        }
        for (var parent in moduleStruct) {
            MyData.push(moduleStruct[parent]);
        }
        $scope.my_data = MyData;
        $scope.defauleSelect = MyData[0].name;
        console.log(MyData)
    }
    var data = {}
    getSource.source('/home/module/list', 'POST', data, getModulsList);
});
