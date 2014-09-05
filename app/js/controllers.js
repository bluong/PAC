'use strict';

/* Controllers */

var app = angular.module('myApp.controllers', []);
var pageSize = 10;

app.controller('appController', ['$scope', '$http', '$sce', '$firebase', function($scope, $http, $sce, $firebase) {
    var emailListRef = new Firebase("https://plntr-anime-project.firebaseio.com/emails");
    var libraryRef = new Firebase("https://plntr-anime-project.firebaseio.com/library");
    var defaultLibraryMap = {info: "", trailer_code: "", vote_count: 0, img_url: "", finished: false};
    $sce.trustAsResourceUrl("http://www.youtube.com/embed/**")

    $scope.announcement = $firebase(new Firebase("https://plntr-anime-project.firebaseio.com/announcement")).$asObject();

    $scope.animelist = $firebase(libraryRef).$asArray();

    $scope.current_anime = $firebase(new Firebase("https://plntr-anime-project.firebaseio.com/current")).$asObject();

    $scope.code = $scope.current_anime.trailer_code;

    $scope.$watch("newAnime.title", function() {
        if ($scope.newAnime == null || $scope.newAnime.title == null) {
            return;
        }
        var library = $firebase(libraryRef).$asArray();
        library.$loaded().then(function() {
            for (var i = 0; i < library.length; i++) {
                if (library[i].title.toLowerCase().indexOf($scope.newAnime.title.toLowerCase()) === 0) {
                    $scope.checkLibrary = library[i].title;
                    return;
                }
            }
            $scope.checkLibrary = "";
        });
    })

    $scope.checkLibrary = "";

    $scope.vote = {selected: ""};
    $scope.updateVote = function()  {
        var votedTitle = $scope.vote.selected;
        if (votedTitle === "") {
            return;
        }
        for (var i = 0; i < $scope.animelist.length; i++) {
            if ($scope.animelist[i].title === votedTitle) {
                $scope.animelist[i].vote_count++;
                $scope.animelist.$save(i);
            }
        }
        alert("Vote has been recorded");
        $('input[name=title]').attr('checked',false);
    }

    $scope.addEmail = function() {
        var email = $scope.email;
        if (email == null) {
            return;
        }
        var emailList = $firebase(emailListRef).$asArray();
        emailList.$loaded().then(function() {
            if (emailList.some(function(emailEntry) {
                return emailEntry.email === email;
            })) {
                alert("Email already exists");
                $('input[name=email]').val("");
                return;
            }
            emailList.$add({email: email});
            $('input[name=email]').val("");
            alert("Email added");
        });
    }

    $scope.addToLibrary = function() {
        var newAnime = $scope.newAnime;
        if (newAnime.title == null) {
            return;
        }
        angular.forEach(defaultLibraryMap, function(value, key) {
            if (newAnime[key] == null) {
                newAnime[key] = value;
            }
        });

        if (newAnime.trailer_url != null) {
            newAnime.trailer_code = parseVideoId(newAnime.trailer_url);
            delete newAnime.trailer_url
        }

        var library = $firebase(libraryRef).$asArray();
        library.$loaded().then(function() {
            if (library.some(function(libraryEntry) {
                return libraryEntry.title === newAnime.title;
            })) {
                alert("Title already exists");
                return;
            }
            library.$add(newAnime);
            $('#submitModal').modal('hide')
            $('#submitModal').find('input').val("");
        });
    }
}]).
controller('entriesController', ['$scope', '$http', '$sce', '$firebase', function($scope, $http, $sce, $firebase) {
    var libraryRef = new Firebase("https://plntr-anime-project.firebaseio.com/library");
    var defaultLibraryMap = {info: "", trailer_code: "", vote_count: 0, img_url: "", finished: false};
    $sce.trustAsResourceUrl("http://www.youtube.com/embed/**");
    $scope.pageSize = 10;
    $scope.currentPage = 0;

    $scope.addToLibrary = function() {
        var newAnime = $scope.newAnime;
        angular.forEach(defaultLibraryMap, function(value, key) {
            if (newAnime[key] == null) {
                newAnime[key] = value;
            }
        });

        if (newAnime.trailer_url != null) {
            newAnime.trailer_code = parseVideoId(newAnime.trailer_url);
            delete newAnime.trailer_url
        }

        var library = $firebase(libraryRef).$asArray();
        library.$loaded().then(function() {
            if (library.some(function(libraryEntry) {
                return libraryEntry.title === newAnime.title;
            })) {
                alert("Title already exists");
                return;
            }
            library.$add(newAnime);
            $('#submitModal').modal('hide')
            $('#submitModal').find('input').val("");
        });
    }
    $scope.entries = $firebase(libraryRef).$asArray();



    $scope.$watch("newAnime.title", function() {
        if ($scope.newAnime == null || $scope.newAnime.title == null) {
            return;
        }
        var library = $firebase(libraryRef).$asArray();
        library.$loaded().then(function() {
            for (var i = 0; i < library.length; i++) {
                if (library[i].title.toLowerCase().indexOf($scope.newAnime.title.toLowerCase()) === 0) {
                    $scope.checkLibrary = library[i].title;
                    return;
                }
            }
            $scope.checkLibrary = "";
        });
    })

    $scope.numberOfPages=function(){
        return Math.ceil($scope.entries.length/$scope.pageSize);
    }
    $scope.openViewModal = function(entry) {
        $scope.selected_entry = entry;
        $('#viewModal').modal('show');
    }
    $scope.openNewModal = function() {
        $('#submitModal').modal('show');
    }
    $scope.openEditModal = function(entry) {
        $scope.selected_entry = entry;
        $('#editModal').find('#image_url').val(entry.img_url);
        $('#editModal').find('#title').val(entry.title);
        $('#editModal').find('#infoLink').val(entry.info);
        if (entry.trailer_code != null && entry.trailer_code != "") {
            $('#editModal').find('#trailer_url').val("http://www.youtube.com/watch?v=" + entry.trailer_code);
        } else {
            $('#editModal').find('#trailer_url').val("");
        }
        $('#editModal').modal('show');
    }
    $scope.editLibraryEntry = function(entry, selected_entry) {
        angular.forEach(selected_entry, function(value, key) {
            if (entry[key] == null) {
                entry[key] = value;
            }
        });

        if (entry.trailer_url != null) {
            entry.trailer_code = parseVideoId(entry.trailer_url);
            delete entry.trailer_url
        }

        var library = $firebase(libraryRef).$asArray();
        library.$loaded().then(function() {
            if (library.some(function(libraryEntry) {
                return (libraryEntry.title === entry.title) && (entry.title !== selected_entry.title);
            })) {
                alert("Title already exists");
                return;
            }
            for (var i = 0; i < library.length; i++) {
                if (library[i].$id === entry.$id) {
                    library[i] = entry;
                    library.$save(i);
                }
            }
            $('#editModal').modal('hide')
            $('#editModal').find('input').val("");
            $('#editModal').find('#infoLink').val(entry.info);
        });
    }
}]).
controller('announcementsController', ['$scope', '$http', '$firebase', function($scope, $http, $firebase) {
    $scope.announcements = $firebase(new Firebase("https://plntr-anime-project.firebaseio.com/announcements")).$asArray();
    $scope.pageSize = pageSize;
    $scope.currentPage = 0;
    $scope.numberOfAnnouncementPages=function(){
        return Math.ceil($scope.announcements.length/$scope.pageSize);
    }

}]).
controller('finishedController', ['$scope', '$http', '$sce', '$firebase', function($scope, $http, $sce, $firebase) {
    var libraryRef = new Firebase("https://plntr-anime-project.firebaseio.com/library");
    var defaultLibraryMap = {info: "", trailer_code: "", vote_count: 0, img_url: "", finished: false};

    $scope.pageSize = 10;
    $scope.currentPage = 0;
    $sce.trustAsResourceUrl("http://www.youtube.com/embed/**");

    $scope.entries = $firebase(libraryRef).$asArray();


    $scope.numberOfFilteredPages=function(){
        var finishedEntries = $scope.entries.filter(function(entry) {
            return entry["finished"];
        })
        return Math.ceil(finishedEntries.length/$scope.pageSize);
    }
    $scope.openfinishedViewModal = function(entry) {
        $scope.selected_entry = entry;
        $('#viewfinishedModal').modal('show');
    }
    $scope.openfinishedEditModal = function(entry) {
        $scope.selected_entry = entry;
        $('#editfinishedModal').find('#image_url').val(entry.img_url);
        $('#editfinishedModal').find('#title').val(entry.title);
        $('#editfinishedModal').find('#infoLink').val(entry.info);
        if (entry.trailer_code != null && entry.trailer_code != "") {
            $('#editfinishedModal').find('#trailer_url').val("http://www.youtube.com/watch?v=" + entry.trailer_code);
        } else {
            $('#editfinishedModal').find('#trailer_url').val("");
        }
        $('#editfinishedModal').modal('show');
    }
    $scope.editfinishedLibraryEntry = function(entry, selected_entry) {
        angular.forEach(selected_entry, function(value, key) {
            if (entry[key] == null) {
                entry[key] = value;
            }
        });

        if (entry.trailer_url != null) {
            entry.trailer_code = parseVideoId(entry.trailer_url);
            delete entry.trailer_url
        }

        var library = $firebase(libraryRef).$asArray();
        library.$loaded().then(function() {
            if (library.some(function(libraryEntry) {
                return (libraryEntry.title === entry.title) && (entry.title !== selected_entry.title);
            })) {
                alert("Title already exists");
                return;
            }
            for (var i = 0; i < library.length; i++) {
                if (library[i].$id === entry.$id) {
                    library[i] = entry;
                    library.$save(i);
                }
            }
            console.log("hi");
            $('#editfinishedModal').modal('hide')
            $('#editfinishedModal').find('input').val("");
            $('#editfinishedModal').find('#infoLink').val(entry.info);
        });
    }
}]).
controller('usersController', ['$scope', '$http', '$sce', '$firebase', function($scope, $http, $sce, $firebase) {
    var usersRef = new Firebase("https://plntr-anime-project.firebaseio.com/users");
    var defaultLibraryMap = {name: "", malLink: ""};
    $scope.pageSize = pageSize;
    $scope.currentPage = 0;
    $scope.openNewModal = function() {
        $('#submitModal').modal('show');
    }

    $scope.addToUsers = function() {
        var newUser = $scope.newUser;
        angular.forEach(defaultLibraryMap, function(value, key) {
            if (newUser[key] == null) {
                newUser[key] = value;
            }
        });

        var users = $firebase(usersRef).$asArray();
        users.$loaded().then(function() {
            users.$add(newUser);
            $('#submitModal').modal('hide')
            $('#submitModal').find('input').val("");
        });
    }
    $scope.users = $firebase(usersRef).$asArray();
    $scope.numberOfUserPages=function(){
        return Math.ceil($scope.users.length/$scope.pageSize);
    }

    $scope.openEditModal = function(user) {
        $scope.selected_user = user;
        $('#editModal').find('#tagname').val(user.tagname);
        $('#editModal').find('#name').val(user.name);
        $('#editModal').find('#malLink').val(user.malLink);
        $('#editModal').modal('show');
    }

    $scope.editUsersEntry = function(entry, selected_entry) {
        angular.forEach(selected_entry, function(value, key) {
            if (entry[key] == null) {
                entry[key] = value;
            }
        });

        var users = $firebase(usersRef).$asArray();
        users.$loaded().then(function() {
            for (var i = 0; i < users.length; i++) {
                if (users[i].$id === entry.$id) {
                    users[i] = entry;
                    users.$save(i);
                }
            }
            $('#editModal').modal('hide');
            $('#editModal').find('input').val("");
        });
    }
}]);

function parseVideoId(youtubeURL) {
    var video_id = youtubeURL.split('v=')[1];
    var ampersandPosition = video_id.indexOf('&');
    if(ampersandPosition != -1) {
      video_id = video_id.substring(0, ampersandPosition);
    }
    return video_id;
}
