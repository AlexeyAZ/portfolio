
Vue.component("site-nav", {
    props: ["list", "navlocation"],
    template: '#site-nav',
    methods: {

        setLocation: function (item) {
            console.log(item);
            this.$emit("link_click", item.location);
        }
    }
});

Vue.component("page-main", {
    props: ["list"],
    template: '#page-main'
});

Vue.component("page-gallery", {
    props: ["list"],
    template: '#page-gallery',
    data: function () {

        return {
            listAr: this.list,
            galleryColumn: 2,
            galleryScrollTop: 0,
            galleryHeight: null,
            galleryRowShow: 1,
            galleryItemSize: {
                height: null,
                width: null
            },
            imgCloudUrl: "https://api.imgur.com/3/image/"
        };
    },

    mounted: function () {
        var self = this;

        window.addEventListener("resize", function () {
            self.setgalleryItemSize();
        });

        this.$http.get('json/gallery.json').then(function (response) {
            var data = response.data;
            var arr = [];

            for (var i = 0; i < 100; i++) {

                arr.push({
                    "name": "site1",
                    "href": "http://",
                    "imgsrc": "http://web-dev.pw/images/i_shop.jpg",
                    "gitlink": "http://",
                    "imgload": "false",
                    "visible": "false",
                    "top": "0",
                    "imgid": "aT2HpJA"
                });
            }

            this.listAr = arr;

            this.$nextTick(function () {
                this.setgalleryItemSize();
                this.galleryHeight = this.$el.querySelector(".gallery__list").scrollHeight;
                this.checkVisible();
            });
        });
    },
    methods: {

        setgalleryItemSize: function () {
            this.galleryItemSize.height = document.documentElement.clientHeight / this.galleryColumn;
            this.galleryItemSize.width = 100 / this.galleryColumn;
            this.setGalleryItemHeightAttr();
        },

        setGalleryItemHeightAttr: function () {
            var coef = 1;
            var height = 1;

            for (var i = 0; i < this.listAr.length; i++) {

                if (i % this.galleryColumn === 0) {
                    coef++;
                }

                height = this.galleryItemSize.height * (coef - 1);
                this.listAr[i].top = height;
            };
        },

        checkVisible: function (e) {

            var self = this;
            var rows = 0;
            var rowTop = 0;
            var coeff = 0;

            if (e) {
                this.galleryScrollTop = e.target.scrollTop;
            } else {
                this.galleryScrollTop = this.$el.querySelector(".gallery__list").scrollTop;
            }

            for (let i = 0; i < this.listAr.length; i++) {

                if (this.listAr[i].top !== rowTop) {
                    rowTop = this.listAr[i].top;
                    rows++;
                }
            }

            for (let i = 0; i < rows; i++) {

                if (this.galleryItemSize.height * i - this.galleryScrollTop < document.documentElement.clientHeight) {

                    for (let j = 0; j < this.galleryColumn; j++) {
                        let number = j + coeff;

                        if (typeof this.listAr[number] !== "undefined" && this.listAr[number].visible === "false") {

                            self.$http.get(this.imgCloudUrl + this.listAr[number].imgid, {
                                headers: { 'authorization': 'Client-ID 4a3569e2cd8829f' }
                            }).then(function (response) {
                                self.listAr[number].imgload = response.body.data.link;
                                self.listAr[number].visible = "true";
                            }, function (error) {
                                console.log('error');
                            });
                        }
                    }
                    coeff += this.galleryColumn;
                }
            }
        }
    },
    watch: {

        list: function (val, oldval) {
            this.setgalleryItemSize();
        }
    }
});

var app = new Vue({
    el: "#app",
    data: {
        appLocation: "gallery",
        contentMove: true,
        links: [{
            name: "Main",
            href: "http://",
            location: "main"
        }, {
            name: "Gallery",
            href: "http://",
            location: "gallery"
        }],
        sites: []
    },

    methods: {

        createArray: function (arr) {
            this.sites = arr;
        },

        renderLocation: function (location) {
            console.log(location);
            this.appLocation = location;
        },

        headerMouseover: function () {
            this.contentMove = !this.contentMove;
            console.log(this.contentMove);
        },

        headerMouseout: function () {
            this.contentMove = !this.contentMove;
            console.log(this.contentMove);
        }
    }
});
//# sourceMappingURL=app.js.map
