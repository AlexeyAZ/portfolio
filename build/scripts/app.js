
Vue.component("site-nav", {
    props: ["list", "navlocation"],
    template: '#site-nav',
    methods: {

        setLocation: function (item, index) {

            for (var i = 0; i < this.list.length; i++) {

                if (index !== i) {
                    this.$emit("link_click", this.list[i].location);
                }
            }
        },

        getNavLinkClass: function (item) {

            if (item.location === this.navlocation) {
                return 'nav__link_active';
            } else {
                return '';
            }
        }
    }
});

Vue.component("page-main", {
    props: ["list"],
    template: '#page-main'
});

Vue.component("page-gallery", {
    props: ["list", "gallerycolumn"],
    template: '#page-gallery',
    data: function () {

        return {
            listAr: [], //this.list,
            galleryColumn: null,
            galleryScrollTop: 0,
            galleryHeight: null,
            galleryRows: 0,
            galleryBuild: false,
            galleryItemSize: {
                height: null,
                width: null
            },
            columns: 4,
            size: {
                item: {
                    height: null,
                    width: null
                },
                list: {
                    height: null,
                    width: null
                }
            },
            imgur: {
                api: {
                    album: 'https://api.imgur.com/3/album/'
                },
                albumhash: '7weNZ'
            },
            galleryArray: [],
            galleryItemTemplate: {
                "name": "site1",
                "href": "http://",
                "imgsrc": "http://web-dev.pw/images/i_shop.jpg",
                "gitlink": "http://",
                "imgload": "false",
                "visible": "false",
                "top": "0",
                "imgid": "aT2HpJA"
            }
        };
    },

    mounted: function () {
        var self = this;
        var resizeTimer;

        window.addEventListener("resize", function () {

            self.setColumnValueOnResize();

            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(function () {
                self.setGallerySizes();
                self.renderGallery();
            }, 250);
        });

        this.$http.get(this.imgur.api.album + this.imgur.albumhash + '/images', {
            headers: { 'authorization': 'Client-ID 4a3569e2cd8829f' }
        }).then(function (response) {

            var data = response.body.data;
            var tempArray = [];

            for (var i = 0; i < data.length; i++) {
                var description = data[i].description;
                var descriptionArr = description.replace(/\s/g, '').split(',');

                var galleryItemObj = {
                    "name": data[i].title,
                    "href": descriptionArr[0],
                    "imgsrc": data[i].link,
                    "gitlink": descriptionArr[1],
                    "imgload": "false",
                    "visible": "false",
                    "top": "0",
                    "imgid": data[i].id,
                    "showframe": "false",
                    "frameload": "false"
                };

                tempArray.push(galleryItemObj);
            }

            this.listAr = tempArray;

            this.setColumnValueOnResize();
            this.setGallerySizes();
            this.renderGallery();
        }, function (error) {
            console.log('error');
            console.log(error);
        });
    },
    methods: {

        itemMouseover: function () {},

        loadFrame: function (item) {
            item.showframe = !JSON.parse(item.showframe);

            if (item.frameload === "true") {
                item.frameload = "false";
            }
        },

        frameLoaded: function (item) {
            item.frameload = "true";
        },

        setGallerySizes: function () {

            this.size.item.height = (document.documentElement.clientWidth - 20) / this.galleryColumn / 1.5;
            this.size.item.width = 100 / this.galleryColumn;
            this.size.list.height = this.$el.querySelector(".gallery__list").scrollHeight;
            this.setGalleryItemHeightAttr();

            var rowTop = 0;
            for (let i = 0; i < this.listAr.length; i++) {

                if (this.listAr[i].top !== rowTop) {
                    rowTop = this.listAr[i].top;
                    this.galleryRows++;
                }
            }
        },

        setColumnValueOnResize: function () {

            if (window.matchMedia("(min-width:1024px)").matches) {
                this.galleryColumn = 4;
            }
            if (window.matchMedia("(max-width:1024px)").matches) {
                this.galleryColumn = 2;
            }
            if (window.matchMedia("(max-width:768px)").matches) {
                this.galleryColumn = 1;
            }

            console.log(this.galleryColumn);
        },

        setColumnSize: function () {
            this.setGallerySizes();
            this.renderGallery();
        },

        setGalleryItemHeightAttr: function () {
            var coef = 1;
            var height = 1;

            for (var i = 0; i < this.listAr.length; i++) {

                if (i % this.galleryColumn === 0) {
                    coef++;
                }

                height = this.size.item.height * (coef - 1);
                this.listAr[i].top = height;
            };
        },

        renderGallery: function (e) {

            var self = this;
            var rowTop = 0;
            var coeff = 0;

            if (e) {
                this.galleryScrollTop = e.target.scrollTop;
            } else {
                this.galleryScrollTop = this.$el.querySelector(".gallery__list").scrollTop;
            }

            for (let i = 0; i < this.galleryRows; i++) {

                if (this.size.item.height * i - this.galleryScrollTop < document.documentElement.clientHeight && !this.galleryBuild) {

                    for (let j = 0; j < this.galleryColumn; j++) {
                        let number = j + coeff;

                        if (typeof this.listAr[number] !== "undefined" && this.listAr[number].visible === "false") {

                            var img = new Image();
                            img.onload = function () {
                                self.listAr[number].imgload = self.listAr[number].imgsrc;
                                self.listAr[number].visible = "true";
                            };

                            img.src = this.listAr[number].imgsrc;

                            if (i + 1 === this.galleryRows) {
                                this.galleryBuild = true;
                            }
                        }
                    }
                    coeff += this.galleryColumn;
                }
            }
        }
    },
    watch: {

        list: function (val, oldval) {
            //this.setGallerySizes();
        }
    }
});

var app = new Vue({
    el: "#app",
    data: {
        appLocation: "gallery",
        contentMove: true,
        column: 2,
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

    created: function () {
        console.log("created");
    },

    methods: {

        createArray: function (arr) {
            this.sites = arr;
        },

        renderLocation: function (location) {
            this.appLocation = location;
        },

        headerMouseover: function () {
            this.contentMove = !this.contentMove;
        },

        headerMouseout: function () {
            this.contentMove = !this.contentMove;
            console.log(this.contentMove);
        }
    }
});
//# sourceMappingURL=app.js.map
