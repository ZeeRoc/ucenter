 app.service('getSource', ['toaster', function(toaster) {
     var rolesList = [];
     this.source = function(url, method, data, callback, tips) {
         var self = this;
         var setting = {
             url: url || '',
             method: method || 'GET',
             data: data || ''
         }

         $.ajax({
                 method: setting.method,
                 data: setting.data,
                 url: setting.url
                 // async: false
             })
             .success(function(data) {
                 data = JSON.parse(data);
                 // console.log(data)
                 if (data.code == 1) {
                    
                     tips ? toaster.pop('success', '操作成功', tips) : 1;
                     callback(data);
                 } else {
                     toaster.pop('error', '操作失败', data.msg);
                 }
             })
             .error(function(data) {
                 toaster.pop('error', '操作提示', '操作失败！');
             });
     }
 }]);
 // .service('getUserList',['getSource',function(getSource){
 //     var getList = function(data) {
 //         $scope.maxSize = 4;
 //         $scope.TotalItems = data.result.totalPage*10;
 //         $scope.CurrentPage = 1;
 //         $scope.list = data.result.users;

 //         return $scope;
 //     }
 //     var data = {
 //         page: 1,
 //         pageSize:10
 //     }
 //     getSource.source('/home/user/list', 'POST', data, getList);
 // }])
