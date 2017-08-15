const vm = new Vue({
    el: '#container',
    data: {
        changeHeader:false,
        list:[]
    },
    mounted(){
        this.initSwiper();
        this.initHeader();
    },
    methods: {
        initSwiper(){
            new Swiper('.swiper-container',{
                loop: true,
                autoplay: 3000,
                speed:600,
                // 如果需要分页器
                pagination: '.swiper-pagination',
            });
        },
        initHeader(){
            var _this = this;
            window.onscroll = function(){
                const scrollTop =document.documentElement.scrollTop||document.body.scrollTop;
                const bannerHeight =document.getElementsByClassName("banner")[0].offsetHeight;
                const header = document.getElementsByTagName("header")[0];

                if(scrollTop >= (bannerHeight-header.offsetHeight)){
                    _this.changeHeader = true;
                }else{
                    _this.changeHeader = false;
                }
            }
        },
        getInfo(){
            let _this = this;
            let url = "/";
            axios.get(url,{
                params:{
                    ajaxFlag:true
                }
            }).then(res => {
                console.log();
                _this.list = res.data.list;
            }).catch(error => {

            })
        }
    }
})

// JSpring([
//     function ($scope, $, module, plugin) {
//         $scope.initSwiper();
//         $scope.initHeader();
//
//     },function($, module){
//         return{
//             changeHeader:false,
//             initSwiper(){
//                 new Swiper('.swiper-container',{
//                     loop: true,
//                     autoplay: 3000,
//                     speed:600,
//                     // 如果需要分页器
//                     pagination: '.swiper-pagination',
//                 });
//             },
//             initHeader(){
//                 var _this = this;
//                 window.onscroll = function(){
//                     const scrollTop =document.documentElement.scrollTop||document.body.scrollTop;
//                     const bannerHeight =document.getElementsByClassName("banner")[0].offsetHeight;
//                     const header = document.getElementsByTagName("header")[0];
//                     console.log(scrollTop >= (bannerHeight-header.offsetHeight))
//                     if(scrollTop >= (bannerHeight-header.offsetHeight)){
//                         _this.changeHeader = true;
//                     }else{
//                         _this.changeHeader = false;
//                     }
//                 }
//             }
//
//         }
//
//     },document.getElementById('tpl'),'#container']);