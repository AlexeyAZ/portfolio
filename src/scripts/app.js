
Vue.component("site-nav", {
    props: ["list", "navlocation", "navstatus"],
    template: '#site-nav',
    data: function() {
        
        return {
            navStatus: this.navstatus,
        }
    },
    methods: {

        setLocation: function(item, index) {

            for (var i = 0; i < this.list.length; i++) {

                if(index !== i) {
                    this.$emit("link_click", this.list[i].location);
                }
            }
        },

        getNavLinkClass: function(item) {

            if (item.location === this.navlocation) {
                return 'nav__link_active'
            } else {
                return '';
            }
        },
    },
});

Vue.component("page-main", {
    props: ["list", "sitelocation"],
    template: '#page-main',
    data: function() {

        return {

            skillsList: ["HTML", "CSS", "JavaScript", "jQuery", "Pug", "Ajax", "Twitter Bootstrap", "less", "sass", "stylus", "SVG", "Gulp", "БЭМ", "Git"],

            aboutMe: {
                mail: "teos.nl@gmail.com",
                skype: "alexey-wm"
            }
        }
    },

    mounted: function() {
        console.log(this.sitelocation);
    },

    methods: {
        
        isMain: function() {
            
            if (this.sitelocation === 'main') {
                console.log(this.sitelocation);
                return true;
            } else {
                return false;
            }
        }
    }
});

Vue.component("page-gallery", {
    props: ["list", "gallerycolumn"],
    template: '#page-gallery',
    data: function() {

        return {
            listAr: [],
            galleryFrame: {
                load: false,
                show: false,
                src: "http://",
                siteItem: null,
                offsets: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    height: 0,
                    width: 0
                }
            },
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
                albumhash: 'khlzi'
            },
        }
    },
    
    mounted: function() {
        var self = this;
        var resizeTimer;

        window.addEventListener("resize", function() {
            
            self.setColumnValueOnResize();
            
            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(function() {
                self.setGallerySizes();
                self.renderGallery();
            }, 250);
        });


        this.$http.get(
            this.imgur.api.album + this.imgur.albumhash + '/images',
            {
                headers: {'authorization': 'Client-ID 4a3569e2cd8829f'},
            }
        ).then(
            function(response) {
                var data = response.body.data;
                var tempArray = [];

                for(var i = 0; i < data.length; i++) {
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
                    }

                    tempArray.push(galleryItemObj);
                }
                
                this.listAr = tempArray;
                
                this.setColumnValueOnResize();
                this.setGallerySizes();
                this.renderGallery();
            },

            function(error) {
                console.log('error');
                console.log(error);
            }
        )
    },
    methods: {

        frameBeforeEnter: function (el) {
            this.$emit('show_nav', false);
        },

        enter: function (el, done) {
            
            done()
        },
        frameAfterEnter: function (el) {
            var self = this;
            var frameContainer = el.querySelector(".gallery__frame-container");
            frameContainer.style = "";

            setTimeout(function() {
                self.galleryFrame.src = self.galleryFrame.siteItem.href;
            }, 1000)
            
        },

        openFrame: function(item, event) {
            this.galleryFrame.siteItem = item;
            this.galleryFrame.show = true;

            function findParentEl(el, cls) {

                while((el = el.parentElement) && !el.classList.contains(cls));
                return el;
            }

            var elem = findParentEl(event.target, "gallery__list-item");
            var galleryFrame = this.$el.querySelector(".gallery__frame-container");

            var elemPosition = elem.getBoundingClientRect();

            this.galleryFrame.offsets.height = elem.clientHeight;
            this.galleryFrame.offsets.width = elem.clientWidth;
            this.galleryFrame.offsets.top = elemPosition.top;
            this.galleryFrame.offsets.left = elemPosition.left;

            galleryFrame.style.height = this.galleryFrame.offsets.height + "px";
            galleryFrame.style.width = this.galleryFrame.offsets.width + "px";
            galleryFrame.style.top = this.galleryFrame.offsets.top + "px";
            galleryFrame.style.left = this.galleryFrame.offsets.left + "px";
        },

        closeFrame: function() {
            this.galleryFrame.show = false;
            this.galleryFrame.load = false;
            this.$emit('show_nav', true);
            this.galleryFrame.src = "http://";
        },

        frameLoad: function() {

            if (this.galleryFrame.src === "http://") {
                this.galleryFrame.load = false;
            } else {
                this.galleryFrame.load = true;
            }

            console.log("frame_load: " + this.galleryFrame.load)
        },

        setGallerySizes: function() {

            this.size.item.height = (document.documentElement.clientWidth - 20) / this.galleryColumn / 1.5;
			this.size.item.width = 100 / this.galleryColumn;
            this.size.list.height = this.$el.querySelector(".gallery__list").scrollHeight;
			this.setGalleryItemHeightAttr();

            var rowTop = 0;
            for(let i = 0; i < this.listAr.length; i++) {
                
                if (this.listAr[i].top !== rowTop) {
                    rowTop = this.listAr[i].top;
                    this.galleryRows++;
                }
            }
        },

        setColumnValueOnResize: function() {

            if (window.matchMedia("(min-width:1024px)").matches) {
                this.galleryColumn = 4;
            }
            if (window.matchMedia("(max-width:1024px)").matches) {
                this.galleryColumn = 2;
            }
            if (window.matchMedia("(max-width:768px)").matches) {
                this.galleryColumn = 1;
            }
        },

		setColumnSize: function() {
			this.setGallerySizes();
			this.renderGallery();
		},

        setGalleryItemHeightAttr: function() {
            var coef = 1;
            var height = 1;

            for(var i = 0; i < this.listAr.length; i++) {

                if (i % this.galleryColumn === 0) {
                    coef++;
                }

                height = this.size.item.height * (coef - 1);
                this.listAr[i].top = height;
            };
        },

        scrollGalleryList: function() {
            var self = this;
            var scrollTimer;

            clearTimeout(scrollTimer);

            scrollTimer = setTimeout(function() {
                self.renderGallery();
            }, 250);
        },

        galleryImgLoaded: function(item) {

            if (item.imgload === 'false') {
                return false;
            } else {
                return true;
            }
        },

        renderGallery: function(e) {
            
            var self = this;
            var rowTop = 0;
            var coeff = 0;

            if(e) {
                this.galleryScrollTop = e.target.scrollTop;
            } else {
                this.galleryScrollTop = this.$el.querySelector(".gallery__list").scrollTop;
            }

            if (!this.galleryBuild) {
                
                for(let i = 0; i < this.galleryRows; i++) {
                
                    if (((this.size.item.height * i - this.galleryScrollTop) < document.documentElement.clientHeight)) {
                        
                        for (let j = 0; j < this.galleryColumn; j++) {
                            let number = j + coeff;

                            if (typeof this.listAr[number] !== "undefined" && this.listAr[number].visible === "false") {

                                var img = new Image();
                                img.onload = function() {
                                    self.listAr[number].imgload = self.listAr[number].imgsrc;
                                    self.listAr[number].visible = "true";
                                }

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
    },
});

var app = new Vue({
    el: "#app",
    data: {
        appLocation: "gallery",
        contentMove: true,
		column: 2,
        showNav: true,
        links: [
            {
                name: "Main",
                href: "http://",
                location: "main",
                class: "fa fa-th",
            },
            {
                name: "Gallery",
                href: "http://",
                location: "gallery",
                class: "fa fa-user-circle"
            },
        ],
        sites: []
    },

	created: function() {
		console.log("created")
	},

    methods: {

        isNav: function(status) {
            this.showNav = status;
        },

        createArray: function(arr) {
            this.sites = arr;
        },

        renderLocation: function(location) {
            this.appLocation = location;
        },

        headerMouseover: function() {
            this.contentMove = !this.contentMove;
        },

        headerMouseout: function() {
            this.contentMove = !this.contentMove;
            console.log(this.contentMove)
        }
    }
})

