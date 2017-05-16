$(function() {

    Vue.component("site-nav", {
        props: ["list", "navlocation"],
        template: '#site-nav',
        methods: {

            setLocation: function(item) {
				console.log(item);
                this.$emit("link_click", item.location);
            },
        },
    });

    Vue.component("page-main", {
        props: ["list"],
        template: '#page-main',
    });

    Vue.component("page-gallery", {
        props: ["list"],
        template: '#page-gallery',
        data: function() {

            return {
                galleryListHeight: 300,
                listAr: this.list
            }
        },
        mounted: function() {
            
            window.addEventListener("resize", this.setGalleryListHeight);

            this.$http.get(
                'json/gallery.json'
            ).then(
                function(response) {
					var data = response.data;
					var item = data[0];
					var arr = [];
					arr.push(item);
					arr.push(item);
					arr.push(item);
					arr.push(item);
					// for (var i = 0; i < 10; i++) {

					// 	for(var j = 0; j < data.length; j++) {
					// 		arr.push(data[j]);
					// 	}
					// }

					// arr.splice(arr.length - 1, 1);
					
                    this.listAr = arr;

					
                    this.$nextTick(function() {
                        this.setGalleryListHeight();
                    });
                }
            )
        },
        methods: {

            setGalleryListHeight: function() {
                //this.galleryListHeight = (this.$el.clientWidth / 3) / 1.5
                this.galleryListHeight = document.querySelector(".gallery__list-item").clientWidth / 1.5;
            },

			loadImg: function() {
				var self = this;
				
				var img = new Image();
				img.onload = function () {
					console.log("image is loaded");
					console.log(self.listAr[2])
					self.listAr[2].imgload = "http://www.planwallpaper.com/static/images/Nikon-D810-Image-Sample-6.jpg";
					self.listAr[3].imgload = "false";
				}
				img.src = "http://www.planwallpaper.com/static/images/Nikon-D810-Image-Sample-6.jpg";

			}
        },
        watch: {

            list: function(val, oldval) {
                this.setGalleryListHeight();
            }
        }
    });

    var app = new Vue({
        el: "#app",
        data: {
            appLocation: "gallery",
            contentMove: true,
            links: [
                {
                    name: "Main",
                    href: "http://",
                    location: "main"
                },
                {
                    name: "Gallery",
                    href: "http://",
                    location: "gallery"
                },
            ],
            sites: []
        },

        mounted: function() {
            // this.$http.get(
            //     'json/gallery.json'
            // ).then(
            //     function(response) {
            //         this.createArray(response.data);
            //     }
            // )
        },

        methods: {

            createArray: function(arr) {
                this.sites = arr;
            },

            renderLocation: function(location) {
                console.log(location)
                this.appLocation = location;
            },

            headerMouseover: function() {
                this.contentMove = !this.contentMove;
                console.log(this.contentMove)
            },

            headerMouseout: function() {
                this.contentMove = !this.contentMove;
                console.log(this.contentMove)
            }
        }
    })

});

