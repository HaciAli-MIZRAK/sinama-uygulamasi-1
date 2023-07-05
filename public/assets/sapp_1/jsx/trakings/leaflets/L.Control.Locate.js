/*!
 Copyright (c) 2016 Dominik Moritz
 
 This file is part of the leaflet locate control. It is licensed under the MIT license.
 You can find the project at: https://github.com/domoritz/leaflet-locatecontrol
 */
(function (factory, window) {
    // see https://github.com/Leaflet/Leaflet/blob/master/PLUGIN-GUIDE.md#module-loaders
    // for details on how to structure a leaflet plugin.

    // define an AMD module that relies on 'leaflet'
    if (typeof define === 'function' && define.amd) {
        define(['leaflet'], factory);

        // define a Common JS module that relies on 'leaflet'
    } else if (typeof exports === 'object') {
        if (typeof window !== 'undefined' && window.L) {
            module.exports = factory(L);
        } else {
            module.exports = factory(require('leaflet'));
        }
    }

    // attach your plugin to the global 'L' variable
    if (typeof window !== 'undefined' && window.L) {
        window.L.Control.Locate = factory(L);
    }
}(function (L) {
    var LDomUtilApplyClassesMethod = function (method, element, classNames) {
        classNames = classNames.split(' ');
        classNames.forEach(function (className) {
            L.DomUtil[method].call(this, element, className);
        });
    };

    var addClasses = function (el, names) {
        LDomUtilApplyClassesMethod('addClass', el, names);
    };
    var removeClasses = function (el, names) {
        LDomUtilApplyClassesMethod('removeClass', el, names);
    };

    /**
     * Compatible with L.Circle but a true marker instead of a path
     */
    var LocationMarker = L.Marker.extend({
        initialize: function (latlng, options) {
            L.Util.setOptions(this, options);
            this._latlng = latlng;
            this.createIcon();
        },

        /**
         * Create a styled circle location marker
         */
        createIcon: function () {
            var opt = this.options;

            var style = '';

            if (opt.color !== undefined) {
                style += 'stroke:' + opt.color + ';';
            }
            if (opt.weight !== undefined) {
                style += 'stroke-width:' + opt.weight + ';';
            }
            if (opt.fillColor !== undefined) {
                style += 'fill:' + opt.fillColor + ';';
            }
            if (opt.fillOpacity !== undefined) {
                style += 'fill-opacity:' + opt.fillOpacity + ';';
            }
            if (opt.opacity !== undefined) {
                style += 'opacity:' + opt.opacity + ';';
            }

            var icon = this._getIconSVG(opt, style);

            this._locationIcon = L.divIcon({
                className: icon.className,
                html: icon.svg,
                iconSize: [icon.w, icon.h],
            });

            this.setIcon(this._locationIcon);
        },

        /**
         * Return the raw svg for the shape
         *
         * Split so can be easily overridden
         */
        _getIconSVG: function (options, style) {
            var r = options.radius;
            var w = options.weight;
            var s = r + w;
            var s2 = s * 2;
            var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + s2 + '" height="' + s2 + '" version="1.1" viewBox="-' + s + ' -' + s + ' ' + s2 + ' ' + s2 + '">' +
                    '<circle r="' + r + '" style="' + style + '" />' +
                    '</svg>';
            return {
                className: 'leaflet-control-locate-location',
                svg: svg,
                w: s2,
                h: s2
            };
        },

        setStyle: function (style) {
            L.Util.setOptions(this, style);
            this.createIcon();
        }
    });

    var CompassMarker = LocationMarker.extend({
        initialize: function (latlng, heading, options) {
            L.Util.setOptions(this, options);
            this._latlng = latlng;
            this._heading = heading;
            this.createIcon();
        },

        setHeading: function (heading) {
            this._heading = heading;
        },

        /**
         * Create a styled arrow compass marker
         */
        _getIconSVG: function (options, style) {
            var r = options.radius;
            var w = (options.width + options.weight);
            var h = (r + options.depth + options.weight) * 2;
            var path = 'M0,0 l' + (options.width / 2) + ',' + options.depth + ' l-' + (w) + ',0 z';
            var svgstyle = 'transform: rotate(' + this._heading + 'deg)';
            var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + (w) + '" height="' + h + '" version="1.1" viewBox="-' + (w / 2) + ' 0 ' + w + ' ' + h + '" style="' + svgstyle + '">' +
                    '<path d="' + path + '" style="' + style + '" />' +
                    '</svg>';
            return {
                className: 'leaflet-control-locate-heading',
                svg: svg,
                w: w,
                h: h
            };
        },
    });


    var LocateControl = L.Control.extend({
        options: {
            /** Position of the control */
            position: 'topleft',
            /** The layer that the user's location should be drawn on. By default creates a new layer. */
            layer: undefined,
            /**
             * Automatically sets the map view (zoom and pan) to the user's location as it updates.
             * While the map is following the user's location, the control is in the `following` state,
             * which changes the style of the control and the circle marker.
             *
             * Possible values:
             *  - false: never updates the map view when location changes.
             *  - 'once': set the view when the location is first determined
             *  - 'always': always updates the map view when location changes.
             *              The map view follows the user's location.
             *  - 'untilPan': like 'always', except stops updating the
             *                view if the user has manually panned the map.
             *                The map view follows the user's location until she pans.
             *  - 'untilPanOrZoom': (default) like 'always', except stops updating the
             *                view if the user has manually panned the map.
             *                The map view follows the user's location until she pans.
             */
            setView: 'untilPanOrZoom',
            /** Keep the current map zoom level when setting the view and only pan. */
            keepCurrentZoomLevel: false,
            /**
             * This callback can be used to override the viewport tracking
             * This function should return a LatLngBounds object.
             *
             * For example to extend the viewport to ensure that a particular LatLng is visible:
             *
             * getLocationBounds: function(locationEvent) {
             *    return locationEvent.bounds.extend([-33.873085, 151.219273]);
             * },
             */
            getLocationBounds: function (locationEvent) {
                return locationEvent.bounds;
            },
            /** Smooth pan and zoom to the location of the marker. Only works in Leaflet 1.0+. */
            flyTo: false,
            /**
             * The user location can be inside and outside the current view when the user clicks on the
             * control that is already active. Both cases can be configures separately.
             * Possible values are:
             *  - 'setView': zoom and pan to the current location
             *  - 'stop': stop locating and remove the location marker
             */
            clickBehavior: {
                /** What should happen if the user clicks on the control while the location is within the current view. */
                inView: 'stop',
                /** What should happen if the user clicks on the control while the location is outside the current view. */
                outOfView: 'setView',
                /**
                 * What should happen if the user clicks on the control while the location is within the current view
                 * and we could be following but are not. Defaults to a special value which inherits from 'inView';
                 */
                inViewNotFollowing: 'inView',
            },
            /**
             * If set, save the map bounds just before centering to the user's
             * location. When control is disabled, set the view back to the
             * bounds that were saved.
             */
            returnToPrevBounds: false,
            /**
             * Keep a cache of the location after the user deactivates the control. If set to false, the user has to wait
             * until the locate API returns a new location before they see where they are again.
             */
            cacheLocation: true,
            /** If set, a circle that shows the location accuracy is drawn. */
            drawCircle: true,
            /** If set, the marker at the users' location is drawn. */
            drawMarker: true,
            /** If set and supported then show the compass heading */
            showCompass: true,
            /** The class to be used to create the marker. For example L.CircleMarker or L.Marker */
            markerClass: LocationMarker,
            /** The class us be used to create the compass bearing arrow */
            compassClass: CompassMarker,
            /** Accuracy circle style properties. NOTE these styles should match the css animations styles */
            circleStyle: {
                className: 'leaflet-control-locate-circle',
                color: '#136AEC',
                fillColor: '#136AEC',
                fillOpacity: 0.15,
                weight: 0
            },
            /** Inner marker style properties. Only works if your marker class supports `setStyle`. */
            markerStyle: {
                className: 'leaflet-control-locate-marker',
                color: '#fff',
                fillColor: '#2A93EE',
                fillOpacity: 1,
                weight: 3,
                opacity: 1,
                radius: 9
            },
            /** Compass */
            compassStyle: {
                fillColor: '#2A93EE',
                fillOpacity: 1,
                weight: 0,
                color: '#fff',
                opacity: 1,
                radius: 9, // How far is the arrow is from the center of of the marker
                width: 9, // Width of the arrow
                depth: 6  // Length of the arrow
            },
            /**
             * Changes to accuracy circle and inner marker while following.
             * It is only necessary to provide the properties that should change.
             */
            followCircleStyle: {},
            followMarkerStyle: {
                // color: '#FFA500',
                // fillColor: '#FFB000'
            },
            followCompassStyle: {},
            /** The CSS class for the icon. For example fa-location-arrow or fa-map-marker */
            icon: 'fa fa-map-marker',
            iconLoading: 'fa fa-spinner fa-spin',
            /** The element to be created for icons. For example span or i */
            iconElementTag: 'span',
            /** Padding around the accuracy circle. */
            circlePadding: [0, 0],
            /** Use metric units. */
            metric: true,
            /**
             * This callback can be used in case you would like to override button creation behavior.
             * This is useful for DOM manipulation frameworks such as angular etc.
             * This function should return an object with HtmlElement for the button (link property) and the icon (icon property).
             */
            createButtonCallback: function (container, options) {
                var link = L.DomUtil.create('a', 'leaflet-bar-part leaflet-bar-part-single', container);
                link.title = options.strings.title;
                var icon = L.DomUtil.create(options.iconElementTag, options.icon, link);
                return {link: link, icon: icon};
            },
            /** This event is called in case of any location error that is not a time out error. */
            onLocationError: function (err, control) {
                alert(err.message);
            },
            /**
             * This event is called when the user's location is outside the bounds set on the map.
             * The event is called repeatedly when the location changes.
             */
            onLocationOutsideMapBounds: function (control) {
                control.stop();
                alert(control.options.strings.outsideMapBoundsMsg);
            },
            /** Display a pop-up when the user click on the inner marker. */
            showPopup: true,
            strings: {
                title: "Show me where I am",
                metersUnit: "meters",
                feetUnit: "feet",
                popup: "You are within {distance} {unit} from this point",
                outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
            },
            /** The default options passed to leaflets locate method. */
            locateOptions: {
                maxZoom: Infinity,
                watch: true, // if you overwrite this, visualization cannot be updated
                setView: false // have to set this to false because we have to
                        // do setView manually
            }
        },

        initialize: function (options) {
            // set default options if nothing is set (merge one step deep)
            for (var i in options) {
                if (typeof this.options[i] === 'object') {
                    L.extend(this.options[i], options[i]);
                } else {
                    this.options[i] = options[i];
                }
            }

            // extend the follow marker style and circle from the normal style
            this.options.followMarkerStyle = L.extend({}, this.options.markerStyle, this.options.followMarkerStyle);
            this.options.followCircleStyle = L.extend({}, this.options.circleStyle, this.options.followCircleStyle);
            this.options.followCompassStyle = L.extend({}, this.options.compassStyle, this.options.followCompassStyle);
        },

        /**
         * Add control to map. Returns the container for the control.
         */
        onAdd: function (map) {
            var container = L.DomUtil.create('div',
                    'leaflet-control-locate leaflet-bar leaflet-control');

            this._layer = this.options.layer || new L.LayerGroup();
            this._layer.addTo(map);
            this._event = undefined;
            this._compassHeading = null;
            this._prevBounds = null;

            var linkAndIcon = this.options.createButtonCallback(container, this.options);
            this._link = linkAndIcon.link;
            this._icon = linkAndIcon.icon;

            L.DomEvent
                    .on(this._link, 'click', L.DomEvent.stopPropagation)
                    .on(this._link, 'click', L.DomEvent.preventDefault)
                    .on(this._link, 'click', this._onClick, this)
                    .on(this._link, 'dblclick', L.DomEvent.stopPropagation);

            this._resetVariables();

            this._map.on('unload', this._unload, this);

            return container;
        },

        /**
         * This method is called when the user clicks on the control.
         */
        _onClick: function () {
            this._justClicked = true;
            var wasFollowing = this._isFollowing();
            this._userPanned = false;
            this._userZoomed = false;

            if (this._active && !this._event) {
                // click while requesting
                this.stop();
            } else if (this._active && this._event !== undefined) {
                var behaviors = this.options.clickBehavior;
                var behavior = behaviors.outOfView;
                if (this._map.getBounds().contains(this._event.latlng)) {
                    behavior = wasFollowing ? behaviors.inView : behaviors.inViewNotFollowing;
                }

                // Allow inheriting from another behavior
                if (behaviors[behavior]) {
                    behavior = behaviors[behavior];
                }

                switch (behavior) {
                    case 'setView':
                        this.setView();
                        break;
                    case 'stop':
                        this.stop();
                        if (this.options.returnToPrevBounds) {
                            var f = this.options.flyTo ? this._map.flyToBounds : this._map.fitBounds;
                            f.bind(this._map)(this._prevBounds);
                        }
                        break;
                }
            } else {
                if (this.options.returnToPrevBounds) {
                    this._prevBounds = this._map.getBounds();
                }
                this.start();
            }

            this._updateContainerStyle();
        },

        /**
         * Starts the plugin:
         * - activates the engine
         * - draws the marker (if coordinates available)
         */
        start: function () {
            this._activate();

            if (this._event) {
                this._drawMarker(this._map);

                // if we already have a location but the user clicked on the control
                if (this.options.setView) {
                    this.setView();
                }
            }
            this._updateContainerStyle();
        },

        /**
         * Stops the plugin:
         * - deactivates the engine
         * - reinitializes the button
         * - removes the marker
         */
        stop: function () {
            this._deactivate();

            this._cleanClasses();
            this._resetVariables();

            this._removeMarker();
        },

        /**
         * Keep the control active but stop following the location
         */
        stopFollowing: function () {
            this._userPanned = true;
            this._updateContainerStyle();
            this._drawMarker();
        },

        /**
         * This method launches the location engine.
         * It is called before the marker is updated,
         * event if it does not mean that the event will be ready.
         *
         * Override it if you want to add more functionalities.
         * It should set the this._active to true and do nothing if
         * this._active is true.
         */
        _activate: function () {
            if (!this._active) {
                this._map.locate(this.options.locateOptions);
                this._active = true;

                // bind event listeners
                this._map.on('locationfound', this._onLocationFound, this);
                this._map.on('locationerror', this._onLocationError, this);
                this._map.on('dragstart', this._onDrag, this);
                this._map.on('zoomstart', this._onZoom, this);
                this._map.on('zoomend', this._onZoomEnd, this);
                if (this.options.showCompass) {
                    if ('ondeviceorientationabsolute' in window) {
                        L.DomEvent.on(window, 'deviceorientationabsolute', this._onDeviceOrientation, this);
                    } else if ('ondeviceorientation' in window) {
                        L.DomEvent.on(window, 'deviceorientation', this._onDeviceOrientation, this);
                    }
                }
            }
        },

        /**
         * Called to stop the location engine.
         *
         * Override it to shutdown any functionalities you added on start.
         */
        _deactivate: function () {
            this._map.stopLocate();
            this._active = false;

            if (!this.options.cacheLocation) {
                this._event = undefined;
            }

            // unbind event listeners
            this._map.off('locationfound', this._onLocationFound, this);
            this._map.off('locationerror', this._onLocationError, this);
            this._map.off('dragstart', this._onDrag, this);
            this._map.off('zoomstart', this._onZoom, this);
            this._map.off('zoomend', this._onZoomEnd, this);
            if (this.options.showCompass) {
                this._compassHeading = null;
                if ('ondeviceorientationabsolute' in window) {
                    L.DomEvent.off(window, 'deviceorientationabsolute', this._onDeviceOrientation, this);
                } else if ('ondeviceorientation' in window) {
                    L.DomEvent.off(window, 'deviceorientation', this._onDeviceOrientation, this);
                }
            }
        },

        /**
         * Zoom (unless we should keep the zoom level) and an to the current view.
         */
        setView: function () {
            this._drawMarker();
            if (this._isOutsideMapBounds()) {
                this._event = undefined;  // clear the current location so we can get back into the bounds
                this.options.onLocationOutsideMapBounds(this);
            } else {
                if (this.options.keepCurrentZoomLevel) {
                    var f = this.options.flyTo ? this._map.flyTo : this._map.panTo;
                    f.bind(this._map)([this._event.latitude, this._event.longitude]);
                } else {
                    var f = this.options.flyTo ? this._map.flyToBounds : this._map.fitBounds;
                    // Ignore zoom events while setting the viewport as these would stop following
                    this._ignoreEvent = true;
                    f.bind(this._map)(this.options.getLocationBounds(this._event), {
                        padding: this.options.circlePadding,
                        maxZoom: this.options.locateOptions.maxZoom
                    });
                    L.Util.requestAnimFrame(function () {
                        // Wait until after the next animFrame because the flyTo can be async
                        this._ignoreEvent = false;
                    }, this);

                }
            }
        },

        /**
         *
         */
        _drawCompass: function () {
            if (!this._event) {
                return;
            }

            var latlng = this._event.latlng;

            if (this.options.showCompass && latlng && this._compassHeading !== null) {
                var cStyle = this._isFollowing() ? this.options.followCompassStyle : this.options.compassStyle;
                if (!this._compass) {
                    this._compass = new this.options.compassClass(latlng, this._compassHeading, cStyle).addTo(this._layer);
                } else {
                    this._compass.setLatLng(latlng);
                    this._compass.setHeading(this._compassHeading);
                    // If the compassClass can be updated with setStyle, update it.
                    if (this._compass.setStyle) {
                        this._compass.setStyle(cStyle);
                    }
                }
                // 
            }
            if (this._compass && (!this.options.showCompass || this._compassHeading === null)) {
                this._compass.removeFrom(this._layer);
                this._compass = null;
            }
        },

        /**
         * Draw the marker and accuracy circle on the map.
         *
         * Uses the event retrieved from onLocationFound from the map.
         */
        _drawMarker: function () {
            if (this._event.accuracy === undefined) {
                this._event.accuracy = 0;
            }

            var radius = this._event.accuracy;
            var latlng = this._event.latlng;

            // circle with the radius of the location's accuracy
            if (this.options.drawCircle) {
                var style = this._isFollowing() ? this.options.followCircleStyle : this.options.circleStyle;

                if (!this._circle) {
                    this._circle = L.circle(latlng, radius, style).addTo(this._layer);
                } else {
                    this._circle.setLatLng(latlng).setRadius(radius).setStyle(style);
                }
            }

            var distance, unit;
            if (this.options.metric) {
                distance = radius.toFixed(0);
                unit = this.options.strings.metersUnit;
            } else {
                distance = (radius * 3.2808399).toFixed(0);
                unit = this.options.strings.feetUnit;
            }

            // small inner marker
            if (this.options.drawMarker) {
                var mStyle = this._isFollowing() ? this.options.followMarkerStyle : this.options.markerStyle;
                if (!this._marker) {
                    this._marker = new this.options.markerClass(latlng, mStyle).addTo(this._layer);
                } else {
                    this._marker.setLatLng(latlng);
                    // If the markerClass can be updated with setStyle, update it.
                    if (this._marker.setStyle) {
                        this._marker.setStyle(mStyle);
                    }
                }
            }

            this._drawCompass();

            var t = this.options.strings.popup;
            if (this.options.showPopup && t && this._marker) {
                this._marker
                        .bindPopup(L.Util.template(t, {distance: distance, unit: unit}))
                        ._popup.setLatLng(latlng);
            }
            if (this.options.showPopup && t && this._compass) {
                this._compass
                        .bindPopup(L.Util.template(t, {distance: distance, unit: unit}))
                        ._popup.setLatLng(latlng);
            }
        },

        /**
         * Remove the marker from map.
         */
        _removeMarker: function () {
            this._layer.clearLayers();
            this._marker = undefined;
            this._circle = undefined;
        },

        /**
         * Unload the plugin and all event listeners.
         * Kind of the opposite of onAdd.
         */
        _unload: function () {
            this.stop();
            this._map.off('unload', this._unload, this);
        },

        /**
         * Sets the compass heading
         */
        _setCompassHeading: function (angle) {
            if (!isNaN(parseFloat(angle)) && isFinite(angle)) {
                angle = Math.round(angle);

                this._compassHeading = angle;
                L.Util.requestAnimFrame(this._drawCompass, this);
            } else {
                this._compassHeading = null;
            }
        },

        /**
         * If the compass fails calibration just fail safely and remove the compass
         */
        _onCompassNeedsCalibration: function () {
            this._setCompassHeading();
        },

        /**
         * Process and normalise compass events
         */
        _onDeviceOrientation: function (e) {
            if (!this._active) {
                return;
            }

            if (e.webkitCompassHeading) {
                // iOS
                this._setCompassHeading(e.webkitCompassHeading);
            } else if (e.absolute && e.alpha) {
                // Android
                this._setCompassHeading(360 - e.alpha)
            }
        },

        /**
         * Calls deactivate and dispatches an error.
         */
        _onLocationError: function (err) {
            // ignore time out error if the location is watched
            if (err.code == 3 && this.options.locateOptions.watch) {
                return;
            }

            this.stop();
            this.options.onLocationError(err, this);
        },

        /**
         * Stores the received event and updates the marker.
         */
        _onLocationFound: function (e) {
            // no need to do anything if the location has not changed
            if (this._event &&
                    (this._event.latlng.lat === e.latlng.lat &&
                            this._event.latlng.lng === e.latlng.lng &&
                            this._event.accuracy === e.accuracy)) {
                return;
            }

            if (!this._active) {
                // we may have a stray event
                return;
            }

            this._event = e;

            this._drawMarker();
            this._updateContainerStyle();

            switch (this.options.setView) {
                case 'once':
                    if (this._justClicked) {
                        this.setView();
                    }
                    break;
                case 'untilPan':
                    if (!this._userPanned) {
                        this.setView();
                    }
                    break;
                case 'untilPanOrZoom':
                    if (!this._userPanned && !this._userZoomed) {
                        this.setView();
                    }
                    break;
                case 'always':
                    this.setView();
                    break;
                case false:
                    // don't set the view
                    break;
            }

            this._justClicked = false;
        },

        /**
         * When the user drags. Need a separate event so we can bind and unbind event listeners.
         */
        _onDrag: function () {
            // only react to drags once we have a location
            if (this._event && !this._ignoreEvent) {
                this._userPanned = true;
                this._updateContainerStyle();
                this._drawMarker();
            }
        },

        /**
         * When the user zooms. Need a separate event so we can bind and unbind event listeners.
         */
        _onZoom: function () {
            // only react to drags once we have a location
            if (this._event && !this._ignoreEvent) {
                this._userZoomed = true;
                this._updateContainerStyle();
                this._drawMarker();
            }
        },

        /**
         * After a zoom ends update the compass and handle sideways zooms
         */
        _onZoomEnd: function () {
            if (this._event) {
                this._drawCompass();
            }

            if (this._event && !this._ignoreEvent) {
                // If we have zoomed in and out and ended up sideways treat it as a pan
                if (this._marker && !this._map.getBounds().pad(-.3).contains(this._marker.getLatLng())) {
                    this._userPanned = true;
                    this._updateContainerStyle();
                    this._drawMarker();
                }
            }
        },

        /**
         * Compute whether the map is following the user location with pan and zoom.
         */
        _isFollowing: function () {
            if (!this._active) {
                return false;
            }

            if (this.options.setView === 'always') {
                return true;
            } else if (this.options.setView === 'untilPan') {
                return !this._userPanned;
            } else if (this.options.setView === 'untilPanOrZoom') {
                return !this._userPanned && !this._userZoomed;
            }
        },

        /**
         * Check if location is in map bounds
         */
        _isOutsideMapBounds: function () {
            if (this._event === undefined) {
                return false;
            }
            return this._map.options.maxBounds &&
                    !this._map.options.maxBounds.contains(this._event.latlng);
        },

        /**
         * Toggles button class between following and active.
         */
        _updateContainerStyle: function () {
            if (!this._container) {
                return;
            }

            if (this._active && !this._event) {
                // active but don't have a location yet
                this._setClasses('requesting');
            } else if (this._isFollowing()) {
                this._setClasses('following');
            } else if (this._active) {
                this._setClasses('active');
            } else {
                this._cleanClasses();
            }
        },

        /**
         * Sets the CSS classes for the state.
         */
        _setClasses: function (state) {
            if (state == 'requesting') {
                removeClasses(this._container, "active following");
                addClasses(this._container, "requesting");

                removeClasses(this._icon, this.options.icon);
                addClasses(this._icon, this.options.iconLoading);
            } else if (state == 'active') {
                removeClasses(this._container, "requesting following");
                addClasses(this._container, "active");

                removeClasses(this._icon, this.options.iconLoading);
                addClasses(this._icon, this.options.icon);
            } else if (state == 'following') {
                removeClasses(this._container, "requesting");
                addClasses(this._container, "active following");

                removeClasses(this._icon, this.options.iconLoading);
                addClasses(this._icon, this.options.icon);
            }
        },

        /**
         * Removes all classes from button.
         */
        _cleanClasses: function () {
            L.DomUtil.removeClass(this._container, "requesting");
            L.DomUtil.removeClass(this._container, "active");
            L.DomUtil.removeClass(this._container, "following");

            removeClasses(this._icon, this.options.iconLoading);
            addClasses(this._icon, this.options.icon);
        },

        /**
         * Reinitializes state variables.
         */
        _resetVariables: function () {
            // whether locate is active or not
            this._active = false;

            // true if the control was clicked for the first time
            // we need this so we can pan and zoom once we have the location
            this._justClicked = false;

            // true if the user has panned the map after clicking the control
            this._userPanned = false;

            // true if the user has zoomed the map after clicking the control
            this._userZoomed = false;
        }
    });

    L.control.locate = function (options) {
        return new L.Control.Locate(options);
    };

    return LocateControl;
}, window));

/*********************************************************
 **                                                      **
 **       Leaflet Plugin "Leaflet.PolylineMeasure"       **
 **       Version: 2019-10-05                            **
 **                                                      **
 *********************************************************/


(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['leaflet'], factory);
    } else if (typeof module !== 'undefined') {
        // Node/CommonJS
        module.exports = factory(require('leaflet'));
    } else {
        // Browser globals
        if (typeof window.L === 'undefined') {
            throw new Error('Leaflet must be loaded first');
        }
        factory(window.L);
    }
}(function (L) {
    var _measureControlId = 'polyline-measure-control';
    var _unicodeClass = 'nint-ruler';

    /**
     * Polyline Measure class
     * @extends L.Control
     */
    L.Control.PolylineMeasure = L.Control.extend({
        /**
         * Default options for the tool
         * @type {Object}
         */
        options: {
            /**
             * Position to show the control. Possible values are: 'topright', 'topleft', 'bottomright', 'bottomleft'
             * @type {String}
             * @default
             */
            position: 'topleft',
            /**
             * Which units the distances are displayed in. Possible values are: 'metres', 'landmiles', 'nauticalmiles'
             * @type {String}
             * @default
             */
            unit: 'metres',
            /**
             * Clear the measurements on stop
             * @type {Boolean}
             * @default
             */
            clearMeasurementsOnStop: true,
            /**
             * Whether bearings are displayed within the tooltips
             * @type {Boolean}
             * @default
             */
            showBearings: false,
            /**
             * Text for the bearing In
             * @type {String}
             * @default
             */
            bearingTextIn: 'In',
            /**
             * Text for the bearing Out
             * @type {String}
             * @default
             */
            bearingTextOut: 'Out',
            /**
             * Text for last point's tooltip
             * @type {String}
             * @default
             */
            tooltipTextFinish: '<b>İşlemi Tamamlamak için</b> Tıklayın<br>',
            tooltipTextDelete: '<b>Noktayı Silmek için</b> SHIFT-Tuşuna Basın ve Tıklayın!',
            tooltipTextMove: '<b>Noktayı Taşımak için</b> Tıklayın ve sürükleyin<br>',
            tooltipTextResume: '<br><b>Seçime Devam Etmek için</b> CTRL Tuşuna Basın ve Tıklayın!',
            tooltipTextAdd: '<b>Nokta Eklemek için</b> CTRL Basılı Tutun!',

            /**
             * Title for the control going to be switched on
             * @type {String}
             * @default
             */
            measureControlTitleOn: "Ölçmek için Tıklayın",
            /**
             * Title for the control going to be switched off
             * @type {String}
             * @default
             */
            measureControlTitleOff: "Ölçme işini bitirin",
            /**
             * Label of the Measure control (maybe a unicode symbol)
             * @type {String}
             * @default
             */
            measureControlLabel: '&#8614;',
            /**
             * Classes to apply to the Measure control
             * @type {Array}
             * @default
             */
            measureControlClasses: [],
            /**
             * Show a control to clear all the measurements
             * @type {Boolean}
             * @default
             */
            showClearControl: false,
            /**
             * Title text to show on the Clear measurements control button
             * @type {String}
             * @default
             */
            clearControlTitle: 'Ölçümleri Temizle',
            /**
             * Label of the Clear control (maybe a unicode symbol)
             * @type {String}
             * @default
             */
            clearControlLabel: '&times;',
            /**
             * Classes to apply to Clear control button
             * @type {Array}
             * @default
             */
            clearControlClasses: [],
            /**
             * Show a control to change the units of measurements
             * @type {Boolean}
             * @default
             */
            showUnitControl: false,
            /**
             * Keep same unit in tooltips in case of distance less then 1 km/mi/nm
             * @type {Boolean}
             * @default
             */
            distanceShowSameUnit: false,
            /**
             * Title texts to show on the Unit Control button
             * @type {Object}
             * @default
             */
            unitControlTitle: {
                text: 'Birim Değiştir',
                metres: 'metre',
                landmiles: 'Kara Mili',
                nauticalmiles: 'Deniz Mili'
            },
            /**
             * Unit symbols to show in the Unit Control button and measurement labels
             * @type {Object}
             * @default
             */
            unitControlLabel: {
                metres: 'm',
                kilometres: 'km',
                feet: 'ft',
                landmiles: 'mi',
                nauticalmiles: 'nm'
            },
            /**
             * Styling settings for the temporary dashed rubberline
             * @type {Object}
             */
            tempLine: {
                /**
                 * Dashed line color
                 * @type {String}
                 * @default
                 */
                color: '#00f',
                /**
                 * Dashed line weight
                 * @type {Number}
                 * @default
                 */
                weight: 2
            },
            /**
             * Styling for the fixed polyline
             * @type {Object}
             */
            fixedLine: {
                /**
                 * Solid line color
                 * @type {String}
                 * @default
                 */
                color: '#006',
                /**
                 * Solid line weight
                 * @type {Number}
                 * @default
                 */
                weight: 2
            },
            /**
             * Style settings for circle marker indicating the starting point of the polyline
             * @type {Object}
             */
            startCircle: {
                /**
                 * Color of the border of the circle
                 * @type {String}
                 * @default
                 */
                color: '#000',
                /**
                 * Weight of the circle
                 * @type {Number}
                 * @default
                 */
                weight: 1,
                /**
                 * Fill color of the circle
                 * @type {String}
                 * @default
                 */
                fillColor: '#0f0',
                /**
                 * Fill opacity of the circle
                 * @type {Number}
                 * @default
                 */
                fillOpacity: 1,
                /**
                 * Radius of the circle
                 * @type {Number}
                 * @default
                 */
                radius: 3
            },
            /**
             * Style settings for all circle markers between startCircle and endCircle
             * @type {Object}
             */
            intermedCircle: {
                /**
                 * Color of the border of the circle
                 * @type {String}
                 * @default
                 */
                color: '#000',
                /**
                 * Weight of the circle
                 * @type {Number}
                 * @default
                 */
                weight: 1,
                /**
                 * Fill color of the circle
                 * @type {String}
                 * @default
                 */
                fillColor: '#ff0',
                /**
                 * Fill opacity of the circle
                 * @type {Number}
                 * @default
                 */
                fillOpacity: 1,
                /**
                 * Radius of the circle
                 * @type {Number}
                 * @default
                 */
                radius: 3
            },
            /**
             * Style settings for circle marker indicating the latest point of the polyline during drawing a line
             * @type {Object}
             */
            currentCircle: {
                /**
                 * Color of the border of the circle
                 * @type {String}
                 * @default
                 */
                color: '#000',
                /**
                 * Weight of the circle
                 * @type {Number}
                 * @default
                 */
                weight: 1,
                /**
                 * Fill color of the circle
                 * @type {String}
                 * @default
                 */
                fillColor: '#f0f',
                /**
                 * Fill opacity of the circle
                 * @type {Number}
                 * @default
                 */
                fillOpacity: 1,
                /**
                 * Radius of the circle
                 * @type {Number}
                 * @default
                 */
                radius: 6
            },
            /**
             * Style settings for circle marker indicating the end point of the polyline
             * @type {Object}
             */
            endCircle: {
                /**
                 * Color of the border of the circle
                 * @type {String}
                 * @default
                 */
                color: '#000',
                /**
                 * Weight of the circle
                 * @type {Number}
                 * @default
                 */
                weight: 1,
                /**
                 * Fill color of the circle
                 * @type {String}
                 * @default
                 */
                fillColor: '#f00',
                /**
                 * Fill opacity of the circle
                 * @type {Number}
                 * @default
                 */
                fillOpacity: 1,
                /**
                 * Radius of the circle
                 * @type {Number}
                 * @default
                 */
                radius: 3
            }
        },

        _arcpoints: 100, // 100 points = 99 line segments. lower value to make arc less accurate or increase value to make it more accurate.
        _circleNr: -1,
        _lineNr: -1,

        /**
         * Create a control button
         * @param {String}      label           Label to add
         * @param {String}      title           Title to show on hover
         * @param {Array}       classesToAdd    Collection of classes to add
         * @param {Element}     container       Parent element
         * @param {Function}    fn              Callback function to run
         * @param {Object}      context         Context
         * @returns {Element}                   Created element
         * @private
         */
        _createControl: function (label, title, classesToAdd, container, fn, context) {
            var anchor = document.createElement('a');
            anchor.innerHTML = label;
            anchor.setAttribute('title', title);
            classesToAdd.forEach(function (c) {
                anchor.classList.add(c);
            });
            L.DomEvent.on(anchor, 'click', fn, context);
            container.appendChild(anchor);
            return anchor;
        },

        /**
         * Method to fire on add to map
         * @param {Object}      map     Map object
         * @returns {Element}           Containing element
         */
        onAdd: function (map) {
            var self = this
            // needed to avoid creating points by mouseclick during dragging the map
            map.on('movestart ', function () {
                self._mapdragging = true
            })
            this._container = document.createElement('div');
            this._container.classList.add('leaflet-bar');
            L.DomEvent.disableClickPropagation(this._container); // otherwise drawing process would instantly start at controls' container or double click would zoom-in map
            var title = this.options.measureControlTitleOn;
            var label = this.options.measureControlLabel;
            var classes = this.options.measureControlClasses;
            if (label.indexOf('&') != -1) {
                classes.push(_unicodeClass);
            }

            // initialize state
            this._arrPolylines = [];
            this._measureControl = this._createControl(label, title, classes, this._container, this._toggleMeasure, this);
            this._defaultControlBgColor = this._measureControl.style.backgroundColor;
            this._measureControl.setAttribute('id', _measureControlId);
            if (this.options.showClearControl) {
                var title = this.options.clearControlTitle;
                var label = this.options.clearControlLabel;
                var classes = this.options.clearControlClasses;
                if (label.indexOf('&') != -1) {
                    classes.push(_unicodeClass);
                }
                this._clearMeasureControl = this._createControl(label, title, classes, this._container, this._clearAllMeasurements, this);
                this._clearMeasureControl.classList.add('polyline-measure-clearControl')
            }
            if (this.options.showUnitControl) {
                if (this.options.unit == "metres") {
                    var label = this.options.unitControlLabel.metres;
                    var title = this.options.unitControlTitle.text + " [" + this.options.unitControlTitle.metres + "]";
                } else if (this.options.unit == "landmiles") {
                    var label = this.options.unitControlLabel.landmiles;
                    var title = this.options.unitControlTitle.text + " [" + this.options.unitControlTitle.landmiles + "]";
                } else {
                    var label = this.options.unitControlLabel.nauticalmiles;
                    var title = this.options.unitControlTitle.text + " [" + this.options.unitControlTitle.nauticalmiles + "]";
                }
                var classes = [];
                this._unitControl = this._createControl(label, title, classes, this._container, this._changeUnit, this);
                this._unitControl.setAttribute('id', 'unitControlId');
            }
            return this._container;
        },

        /**
         * Method to fire on remove from map
         */
        onRemove: function () {
            if (this._measuring) {
                this._toggleMeasure();
            }
        },

        // turn off all Leaflet-own events of markers (popups, tooltips). Needed to allow creating points on top of markers
        _saveNonpolylineEvents: function () {
            this._nonpolylineTargets = this._map._targets;
            if (typeof this._polylineTargets !== 'undefined') {
                this._map._targets = this._polylineTargets;
            } else {
                this._map._targets = {};
            }
        },

        // on disabling the measure add-on, save Polyline-measure events and enable the former Leaflet-own events again
        _savePolylineEvents: function () {
            this._polylineTargets = this._map._targets;
            this._map._targets = this._nonpolylineTargets;
        },

        /**
         * Toggle the measure functionality on or off
         * @private
         */
        _toggleMeasure: function () {
            this._measuring = !this._measuring;
            if (this._measuring) {   // if measuring is going to be switched on
                this._mapdragging = false;
                this._saveNonpolylineEvents();
                this._measureControl.classList.add('polyline-measure-controlOnBgColor');
                this._measureControl.style.backgroundColor = this.options.backgroundColor;
                this._measureControl.title = this.options.measureControlTitleOff;
                this._oldCursor = this._map._container.style.cursor;          // save former cursor type
                this._map._container.style.cursor = 'crosshair';
                this._doubleClickZoom = this._map.doubleClickZoom.enabled();  // save former status of doubleClickZoom
                this._map.doubleClickZoom.disable();
                // create LayerGroup "layerPaint" (only) the first time Measure Control is switched on
                if (!this._layerPaint) {
                    this._layerPaint = L.layerGroup().addTo(this._map);
                }
                this._map.on('mousemove', this._mouseMove, this);   //  enable listing to 'mousemove', 'click', 'keydown' events
                this._map.on('click', this._mouseClick, this);
                L.DomEvent.on(document, 'keydown', this._onKeyDown, this);
                this._resetPathVariables();
            } else {   // if measuring is going to be switched off
                this._savePolylineEvents();
                this._measureControl.classList.remove('polyline-measure-controlOnBgColor');
                this._measureControl.style.backgroundColor = this._defaultControlBgColor;
                this._measureControl.title = this.options.measureControlTitleOn;
                this._map._container.style.cursor = this._oldCursor;
                this._map.off('mousemove', this._mouseMove, this);
                this._map.off('click', this._mouseClick, this);
                this._map.off('mousemove', this._resumeFirstpointMousemove, this);
                this._map.off('click', this._resumeFirstpointClick, this);
                this._map.off('mousemove', this._dragCircleMousemove, this);
                this._map.off('mouseup', this._dragCircleMouseup, this);
                L.DomEvent.off(document, 'keydown', this._onKeyDown, this);
                if (this._doubleClickZoom) {
                    this._map.doubleClickZoom.enable();
                }
                if (this.options.clearMeasurementsOnStop && this._layerPaint) {
                    this._clearAllMeasurements();
                }
                // to remove temp. Line if line at the moment is being drawn and not finished while clicking the control
                if (this._cntCircle !== 0) {
                    this._finishPolylinePath();
                }
            }
            // allow easy to connect the measure control to the app, f.e. to disable the selection on the map when the measurement is turned on
            this._map.fire('polylinemeasure:toggle', {sttus: this._measuring});
        },

        /**
         * Clear all measurements from the map
         */
        _clearAllMeasurements: function () {
            if ((this._cntCircle !== undefined) && (this._cntCircle !== 0)) {
                this._finishPolylinePath();
            }
            if (this._layerPaint) {
                this._layerPaint.clearLayers();
            }
            this._arrPolylines = [];
        },

        _changeUnit: function () {
            if (this.options.unit == "metres") {
                this.options.unit = "landmiles";
                document.getElementById("unitControlId").innerHTML = this.options.unitControlLabel.landmiles;
                this._unitControl.title = this.options.unitControlTitle.text + " [" + this.options.unitControlTitle.landmiles + "]";
            } else if (this.options.unit == "landmiles") {
                this.options.unit = "nauticalmiles";
                document.getElementById("unitControlId").innerHTML = this.options.unitControlLabel.nauticalmiles;
                this._unitControl.title = this.options.unitControlTitle.text + " [" + this.options.unitControlTitle.nauticalmiles + "]";
            } else {
                this.options.unit = "metres";
                document.getElementById("unitControlId").innerHTML = this.options.unitControlLabel.metres;
                this._unitControl.title = this.options.unitControlTitle.text + " [" + this.options.unitControlTitle.metres + "]";
            }
            this._arrPolylines.map(function (line) {
                var totalDistance = 0;
                line.circleCoords.map(function (point, point_index) {
                    if (point_index >= 1) {
                        var distance = line.circleCoords [point_index - 1].distanceTo(line.circleCoords [point_index]);
                        totalDistance += distance;
                        this._updateTooltip(line.tooltips [point_index], line.tooltips [point_index - 1], totalDistance, distance, line.circleCoords [point_index - 1], line.circleCoords [point_index]);
                    }
                }.bind(this));
            }.bind(this));
        },

        /**
         * Event to fire when a keyboard key is depressed.
         * Currently only watching for ESC key (= keyCode 27). 1st press finishes line, 2nd press turns Measuring off.
         * @param {Object} e Event
         * @private
         */
        _onKeyDown: function (e) {
            if (e.keyCode === 27) {
                // if resuming a line at its first point is active
                if (this._resumeFirstpointFlag === true) {
                    this._resumeFirstpointFlag = false;
                    var lineNr = this._lineNr;
                    this._map.off('mousemove', this._resumeFirstpointMousemove, this);
                    this._map.off('click', this._resumeFirstpointClick, this);
                    this._layerPaint.removeLayer(this._rubberlinePath2);
                    this._layerPaint.removeLayer(this._tooltipNew);
                    this._arrPolylines[lineNr].circleMarkers [0].setStyle(this.options.startCircle);
                    var text = '';
                    var totalDistance = 0;
                    if (this.options.showBearings === true) {
                        text = this.options.bearingTextIn + ':---°<br>' + this.options.bearingTextOut + ':---°';
                    }
                    text = text + '<div class="polyline-measure-tooltip-difference">+' + '0</div>';
                    text = text + '<div class="polyline-measure-tooltip-total">' + '0</div>';
                    this._arrPolylines[lineNr].tooltips [0]._icon.innerHTML = text;
                    this._arrPolylines[lineNr].tooltips.map(function (item, index) {
                        if (index >= 1) {
                            var distance = this._arrPolylines[lineNr].circleCoords[index - 1].distanceTo(this._arrPolylines[lineNr].circleCoords[index]);
                            var lastCircleCoords = this._arrPolylines[lineNr].circleCoords[index - 1];
                            var mouseCoords = this._arrPolylines[lineNr].circleCoords[index];
                            totalDistance += distance;
                            var prevTooltip = this._arrPolylines[lineNr].tooltips[index - 1]
                            this._updateTooltip(item, prevTooltip, totalDistance, distance, lastCircleCoords, mouseCoords);
                        }
                    }.bind(this));
                    this._map.on('mousemove', this._mouseMove, this);
                    return
                }
                // if NOT drawing a line, ESC will directly switch of measuring
                if (!this._currentLine) {
                    this._toggleMeasure();
                } else {
                    this._finishPolylinePath(e);
                }
            }
        },

        /**
         * Get the distance in the format specified in the options
         * @param {Number} distance Distance to convert
         * @returns {{value: *, unit: *}}
         * @private
         */
        _getDistance: function (distance) {
            var dist = distance;
            var unit;
            if (this.options.unit === 'nauticalmiles') {
                unit = this.options.unitControlLabel.nauticalmiles;
                if (dist >= 185200) {
                    dist = (dist / 1852).toFixed(0);
                } else if (dist >= 18520) {
                    dist = (dist / 1852).toFixed(1);
                } else if (dist >= 1852) {
                    dist = (dist / 1852).toFixed(2);
                } else {
                    if (this.options.distanceShowSameUnit) {
                        dist = (dist / 1852).toFixed(3);
                    } else {
                        dist = (dist / 0.3048).toFixed(0);
                        unit = this.options.unitControlLabel.feet;
                    }
                }
            } else if (this.options.unit === 'landmiles') {
                unit = this.options.unitControlLabel.landmiles;
                if (dist >= 160934.4) {
                    dist = (dist / 1609.344).toFixed(0);
                } else if (dist >= 16093.44) {
                    dist = (dist / 1609.344).toFixed(1);
                } else if (dist >= 1609.344) {
                    dist = (dist / 1609.344).toFixed(2);
                } else {
                    if (this.options.distanceShowSameUnit) {
                        dist = (dist / 1609.344).toFixed(3);
                    } else {
                        dist = (dist / 0.3048).toFixed(0);
                        unit = this.options.unitControlLabel.feet;
                    }
                }
            } else {
                unit = this.options.unitControlLabel.kilometres;
                if (dist >= 100000) {
                    dist = (dist / 1000).toFixed(0);
                } else if (dist >= 10000) {
                    dist = (dist / 1000).toFixed(1);
                } else if (dist >= 1000) {
                    dist = (dist / 1000).toFixed(2);
                } else {
                    if (this.options.distanceShowSameUnit) {
                        dist = (dist / 1000).toFixed(3);
                    } else {
                        dist = (dist).toFixed(0);
                        unit = this.options.unitControlLabel.metres;
                    }
                }
            }
            return {value: dist, unit: unit};
        },

        /**
         * Calculate Great-circle Arc (= shortest distance on a sphere like the Earth) between two coordinates
         * formulas: http://www.edwilliams.org/avform.htm
         * @private
         */
        _polylineArc: function (_from, _to) {
            function _GCinterpolate(f) {
                var A = Math.sin((1 - f) * d) / Math.sin(d);
                var B = Math.sin(f * d) / Math.sin(d);
                var x = A * Math.cos(fromLat) * Math.cos(fromLng) + B * Math.cos(toLat) * Math.cos(toLng);
                var y = A * Math.cos(fromLat) * Math.sin(fromLng) + B * Math.cos(toLat) * Math.sin(toLng);
                var z = A * Math.sin(fromLat) + B * Math.sin(toLat);
                // atan2 better than atan-function cause results are from -pi to +pi
                // => results of latInterpol, lngInterpol always within range -180° ... +180°  => conversion into values < -180° or > + 180° has to be done afterwards
                var latInterpol = 180 / Math.PI * Math.atan2(z, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
                var lngInterpol = 180 / Math.PI * Math.atan2(y, x);
                // don't split polyline if it crosses dateline ( -180° or +180°).  Without the polyline would look like: +179° ==> +180° ==> -180° ==> -179°...
                // algo: if difference lngInterpol-from.lng is > 180° there's been an unwanted split from +180 to -180 cause an arc can never span >180°
                var diff = lngInterpol - fromLng * 180 / Math.PI;
                function trunc(n) {
                    return Math[n > 0 ? "floor" : "ceil"](n);
                }   // alternatively we could use the new Math.trunc method, but Internet Explorer doesn't know it
                if (diff < 0) {
                    lngInterpol = lngInterpol - trunc((diff - 180) / 360) * 360;
                } else {
                    lngInterpol = lngInterpol - trunc((diff + 180) / 360) * 360;
                }
                return [latInterpol, lngInterpol];
            }

            function _GCarc(npoints) {
                var arrArcCoords = [];
                var delta = 1.0 / (npoints - 1);
                // first point of Arc should NOT be returned
                for (var i = 0; i < npoints; i++) {
                    var step = delta * i;
                    var coordPair = _GCinterpolate(step);
                    arrArcCoords.push(coordPair);
                }
                return arrArcCoords;
            }

            var fromLat = _from.lat;  // work with with copies of object's elements _from.lat and _from.lng, otherwise they would get modiefied due to call-by-reference on Objects in Javascript
            var fromLng = _from.lng;
            var toLat = _to.lat;
            var toLng = _to.lng;
            fromLat = fromLat * Math.PI / 180;
            fromLng = fromLng * Math.PI / 180;
            toLat = toLat * Math.PI / 180;
            toLng = toLng * Math.PI / 180;
            var d = 2.0 * Math.asin(Math.sqrt(Math.pow(Math.sin((fromLat - toLat) / 2.0), 2) + Math.cos(fromLat) * Math.cos(toLat) * Math.pow(Math.sin((fromLng - toLng) / 2.0), 2)));
            var arrLatLngs;
            if (d === 0) {
                arrLatLngs = [[fromLat, fromLng]];
            } else {
                arrLatLngs = _GCarc(this._arcpoints);
            }
            return arrLatLngs;
        },

        /**
         * Update the tooltip distance
         * @param {Number} total        Total distance
         * @param {Number} difference   Difference in distance between 2 points
         * @private
         */
        _updateTooltip: function (currentTooltip, prevTooltip, total, difference, lastCircleCoords, mouseCoords) {
            // Explanation of formula: http://www.movable-type.co.uk/scripts/latlong.html
            var calcAngle = function (p1, p2, direction) {
                var lat1 = p1.lat / 180 * Math.PI;
                var lat2 = p2.lat / 180 * Math.PI;
                var lng1 = p1.lng / 180 * Math.PI;
                var lng2 = p2.lng / 180 * Math.PI;
                var y = Math.sin(lng2 - lng1) * Math.cos(lat2);
                var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1);
                if (direction === "inbound") {
                    var brng = (Math.atan2(y, x) * 180 / Math.PI + 180).toFixed(0);
                } else {
                    var brng = (Math.atan2(y, x) * 180 / Math.PI + 360).toFixed(0);
                }
                return (brng % 360);
            }

            var angleIn = calcAngle(mouseCoords, lastCircleCoords, "inbound");
            var angleOut = calcAngle(lastCircleCoords, mouseCoords, "outbound");
            var totalRound = this._getDistance(total);
            var differenceRound = this._getDistance(difference);
            var textCurrent = '';
            if (differenceRound.value > 0) {
                if (this.options.showBearings === true) {
                    textCurrent = this.options.bearingTextIn + ': ' + angleIn + '°<br>' + this.options.bearingTextOut + ':---°';
                }
                textCurrent += '<div class="polyline-measure-tooltip-difference">+' + differenceRound.value + '&nbsp;' + differenceRound.unit + '</div>';
            }
            textCurrent += '<div class="polyline-measure-tooltip-total">' + totalRound.value + '&nbsp;' + totalRound.unit + '</div>';
            currentTooltip._icon.innerHTML = textCurrent;
            if ((this.options.showBearings === true) && (prevTooltip)) {
                var textPrev = prevTooltip._icon.innerHTML;
                var regExp = new RegExp(this.options.bearingTextOut + '.*\°');
                var textReplace = textPrev.replace(regExp, this.options.bearingTextOut + ': ' + angleOut + "°");
                prevTooltip._icon.innerHTML = textReplace;
            }
        },

        _drawArrow: function (arcLine) {
            var midpoint = Math.round(arcLine.length / 2);
            var P1 = arcLine[midpoint - 1];
            var P2 = arcLine[midpoint];
            var diffLng12 = P2[1] - P1[1];
            var diffLat12 = P2[0] - P1[0];
            var center = [P1[0] + diffLat12 / 2, P1[1] + diffLng12 / 2];  // center of Great-circle distance, NOT of the arc on a Mercator map! reason: a) to complicated b) map not always Mercator c) good optical feature to see where real center of distance is not the "virtual" warped arc center due to Mercator projection
            // angle just an aprroximation, which could be somewhat off if Line runs near high latitudes. Use of *geographical coords* for line segment P1 to P2 is best method. Use of *Pixel coords* for just one arc segement P1 to P2 could create for short lines unexact rotation angles, and the use Use of Pixel coords between endpoints [0] to [99] (in case of 100-point-arc) results in even more rotation difference for high latitudes as with geogrpaphical coords-method
            var cssAngle = -Math.atan2(diffLat12, diffLng12) * 57.29578   // convert radiant to degree as needed for use as CSS value; cssAngle is opposite to mathematical angle.
            var iconArrow = L.divIcon({
                className: "", // to avoid getting a default class with paddings and borders assigned by Leaflet
                iconSize: [16, 16],
                iconAnchor: [8, 8],
                // html : "<img src='iconArrow.png' style='background:green; height:100%; vertical-align:top; transform:rotate("+ cssAngle +"deg)'>"  <<=== alternative method by the use of an image instead of a Unicode symbol.
                html: "<div style = 'font-size: 16px; line-height: 16px; vertical-align:top; transform: rotate(" + cssAngle + "deg)'>&#x27a4;</div>"   // best results if iconSize = font-size = line-height and iconAnchor font-size/2 .both values needed to position symbol in center of L.divIcon for all font-sizes.
            });
            var newArrowMarker = L.marker(center, {icon: iconArrow, zIndexOffset: -50}).addTo(this._layerPaint);  // zIndexOffset to draw arrows below tooltips
            if (!this._currentLine) {  // just bind tooltip if not drawing line anymore, cause following the instruction of tooltip is just possible when not drawing a line
                newArrowMarker.bindTooltip(this.options.tooltipTextAdd, {direction: 'top', opacity: 0.7, className: 'polyline-measure-popupTooltip'});
            }
            newArrowMarker.on('click', this._clickedArrow, this);
            return newArrowMarker;
        },

        /**
         * Event to fire on mouse move
         * @param {Object} e Event
         * @private
         */
        _mouseMove: function (e) {
            var mouseCoords = e.latlng;
            this._map.on('click', this._mouseClick, this);  // necassary for _dragCircle. If switched on already within _dragCircle an unwanted click is fired at the end of the drag.
            if (!mouseCoords || !this._currentLine) {
                return;
            }
            var lastCircleCoords = this._currentLine.circleCoords.last();
            this._rubberlinePath.setLatLngs(this._polylineArc(lastCircleCoords, mouseCoords));
            var currentTooltip = this._currentLine.tooltips.last();
            var prevTooltip = this._currentLine.tooltips.slice(-2, -1)[0];
            currentTooltip.setLatLng(mouseCoords);
            var distanceSegment = mouseCoords.distanceTo(lastCircleCoords);
            this._updateTooltip(currentTooltip, prevTooltip, this._currentLine.distance + distanceSegment, distanceSegment, lastCircleCoords, mouseCoords);
        },

        _startLine: function (clickCoords) {
            var icon = L.divIcon({
                className: 'polyline-measure-tooltip',
                iconAnchor: [-4, -4]
            });
            var last = function () {
                return this.slice(-1)[0];
            };
            this._rubberlinePath = L.polyline([], {
                // Style of temporary, dashed line while moving the mouse
                color: this.options.tempLine.color,
                weight: this.options.tempLine.weight,
                interactive: false,
                dashArray: '8,8'
            }).addTo(this._layerPaint).bringToBack();

            var polylineState = this;   // use "polylineState" instead of "this" to allow measuring on 2 different maps the same time

            this._currentLine = {
                id: 0,
                circleCoords: [],
                circleMarkers: [],
                arrowMarkers: [],
                tooltips: [],
                distance: 0,

                polylinePath: L.polyline([], {
                    // Style of fixed, polyline after mouse is clicked
                    color: this.options.fixedLine.color,
                    weight: this.options.fixedLine.weight,
                    interactive: false
                }).addTo(this._layerPaint).bringToBack(),

                handleMarkers: function (latlng) {
                    // update style on previous marker
                    var lastCircleMarker = this.circleMarkers.last();
                    if (lastCircleMarker) {
                        lastCircleMarker.bindTooltip(polylineState.options.tooltipTextDelete, {direction: 'top', opacity: 0.7, className: 'polyline-measure-popupTooltip'});
                        lastCircleMarker.off('click', polylineState._finishPolylinePath, polylineState);
                        if (this.circleMarkers.length === 1) {
                            lastCircleMarker.setStyle(polylineState.options.startCircle);
                        } else {
                            lastCircleMarker.setStyle(polylineState.options.intermedCircle);
                        }
                    }
                    var newCircleMarker = new L.CircleMarker(latlng, polylineState.options.currentCircle).addTo(polylineState._layerPaint);
                    newCircleMarker.bindTooltip(polylineState.options.tooltipTextFinish + polylineState.options.tooltipTextDelete, {direction: 'top', opacity: 0.7, className: 'polyline-measure-popupTooltip'});
                    newCircleMarker.cntLine = polylineState._currentLine.id;
                    newCircleMarker.cntCircle = polylineState._cntCircle;
                    polylineState._cntCircle++;
                    newCircleMarker.on('mousedown', polylineState._dragCircle, polylineState);
                    newCircleMarker.on('click', polylineState._finishPolylinePath, polylineState);
                    this.circleMarkers.push(newCircleMarker);
                },

                getNewToolTip: function (latlng) {
                    return L.marker(latlng, {
                        icon: icon,
                        interactive: false
                    });
                },

                addPoint: function (mouseCoords) {
                    var lastCircleCoords = this.circleCoords.last();
                    if (lastCircleCoords && lastCircleCoords.equals(mouseCoords)) {    // don't add a new circle if the click was onto the last circle
                        return;
                    }
                    this.circleCoords.push(mouseCoords);
                    // update polyline
                    if (this.circleCoords.length > 1) {
                        var arc = polylineState._polylineArc(lastCircleCoords, mouseCoords);
                        if (this.circleCoords.length > 2) {
                            arc.shift();  // remove first coordinate og the arc, cause it is identical with last coordinate of previous arc
                        }
                        this.polylinePath.setLatLngs(this.polylinePath.getLatLngs().concat(arc));
                        // following lines needed especially for Mobile Browsers where we just use mouseclicks. No mousemoves, no tempLine.
                        var arrowMarker = polylineState._drawArrow(arc);
                        arrowMarker.cntLine = polylineState._currentLine.id;
                        arrowMarker.cntArrow = polylineState._cntCircle - 1;
                        polylineState._currentLine.arrowMarkers.push(arrowMarker);
                        var distanceSegment = lastCircleCoords.distanceTo(mouseCoords);
                        this.distance += distanceSegment;
                        var currentTooltip = polylineState._currentLine.tooltips.last();
                        var prevTooltip = polylineState._currentLine.tooltips.slice(-1, -2)[0];
                        polylineState._updateTooltip(currentTooltip, prevTooltip, this.distance, distanceSegment, lastCircleCoords, mouseCoords);
                    }
                    // update last tooltip with final value
                    if (currentTooltip) {
                        currentTooltip.setLatLng(mouseCoords);
                    }
                    // add new tooltip to update on mousemove
                    var tooltipNew = this.getNewToolTip(mouseCoords);
                    tooltipNew.addTo(polylineState._layerPaint);
                    this.tooltips.push(tooltipNew);
                    this.handleMarkers(mouseCoords);
                },

                finalize: function () {
                    // remove tooltip created by last click
                    polylineState._layerPaint.removeLayer(this.tooltips.last());
                    this.tooltips.pop();
                    // remove temporary rubberline
                    polylineState._layerPaint.removeLayer(polylineState._rubberlinePath);
                    if (this.circleCoords.length > 1) {
                        this.tooltips.last()._icon.classList.add('polyline-measure-tooltip-end'); // add Class e.g. another background-color to the Previous Tooltip (which is the last fixed tooltip, cause the moving tooltip is being deleted later)
                        var lastCircleMarker = this.circleMarkers.last()
                        lastCircleMarker.setStyle(polylineState.options.endCircle);
                        // use Leaflet's own tooltip method to shwo a popuo tooltip if user hovers the last circle of a polyline
                        lastCircleMarker.unbindTooltip();  // to close the opened Tooltip after it's been opened after click onto point to finish the line
                        polylineState._currentLine.circleMarkers.map(function (circle) {
                            circle.bindTooltip(polylineState.options.tooltipTextMove + polylineState.options.tooltipTextDelete, {direction: 'top', opacity: 0.7, className: 'polyline-measure-popupTooltip'})
                        });
                        polylineState._currentLine.circleMarkers[0].bindTooltip(polylineState.options.tooltipTextMove + polylineState.options.tooltipTextDelete + polylineState.options.tooltipTextResume, {direction: 'top', opacity: 0.7, className: 'polyline-measure-popupTooltip'});
                        lastCircleMarker.bindTooltip(polylineState.options.tooltipTextMove + polylineState.options.tooltipTextDelete + polylineState.options.tooltipTextResume, {direction: 'top', opacity: 0.7, className: 'polyline-measure-popupTooltip'});
                        polylineState._currentLine.arrowMarkers.map(function (arrow) {
                            arrow.bindTooltip(polylineState.options.tooltipTextAdd, {direction: 'top', opacity: 0.7, className: 'polyline-measure-popupTooltip'})
                        });
                        lastCircleMarker.off('click', polylineState._finishPolylinePath, polylineState);
                        lastCircleMarker.on('click', polylineState._resumePolylinePath, polylineState);
                        polylineState._arrPolylines.push(this);
                    } else {
                        // if there is only one point, just clean it up
                        polylineState._layerPaint.removeLayer(this.circleMarkers.last());
                        polylineState._layerPaint.removeLayer(this.tooltips.last());
                    }
                    polylineState._resetPathVariables();
                }
            };

            var firstTooltip = L.marker(clickCoords, {
                icon: icon,
                interactive: false
            })
            firstTooltip.addTo(this._layerPaint);
            var text = '';
            if (this.options.showBearings === true) {
                text = this.options.bearingTextIn + ':---°<br>' + this.options.bearingTextOut + ':---°';
            }
            text = text + '<div class="polyline-measure-tooltip-difference">+' + '0</div>';
            text = text + '<div class="polyline-measure-tooltip-total">' + '0</div>';
            firstTooltip._icon.innerHTML = text;
            this._currentLine.tooltips.push(firstTooltip);
            this._currentLine.circleCoords.last = last;
            this._currentLine.tooltips.last = last;
            this._currentLine.circleMarkers.last = last;
            this._currentLine.id = this._arrPolylines.length;
        },

        /**
         * Event to fire on mouse click
         * @param {Object} e Event
         * @private
         */
        _mouseClick: function (e) {
            // skip if there are no coords provided by the event, or this event's screen coordinates match those of finishing CircleMarker for the line we just completed
            if (!e.latlng || (this._finishCircleScreencoords && this._finishCircleScreencoords.equals(e.containerPoint))) {
                return;
            }

            if (!this._currentLine && !this._mapdragging) {
                this._startLine(e.latlng);
            }
            // just create a point if the map isn't dragged during the mouseclick.
            if (!this._mapdragging) {
                this._currentLine.addPoint(e.latlng);
            } else {
                this._mapdragging = false; // this manual setting to "false" needed, instead of a "moveend"-Event. Cause the mouseclick of a "moveend"-event immediately would create a point too the same time.
            }
        },

        /**
         * Finish the drawing of the path by clicking onto the last circle or pressing ESC-Key
         * @private
         */
        _finishPolylinePath: function (e) {
            this._currentLine.finalize();
            if (e) {
                this._finishCircleScreencoords = e.containerPoint;
            }
        },

        /**
         * Resume the drawing of a polyline by pressing CTRL-Key and clicking onto the last circle
         * @private
         */
        _resumePolylinePath: function (e) {
            if (e.originalEvent.ctrlKey === true) {    // just resume if user pressed the CTRL-Key while clicking onto the last circle
                this._currentLine = this._arrPolylines [e.target.cntLine];
                this._rubberlinePath = L.polyline([], {
                    // Style of temporary, rubberline while moving the mouse
                    color: this.options.tempLine.color,
                    weight: this.options.tempLine.weight,
                    interactive: false,
                    dashArray: '8,8'
                }).addTo(this._layerPaint).bringToBack();
                this._currentLine.tooltips.last()._icon.classList.remove('polyline-measure-tooltip-end');   // remove extra CSS-class of previous, last tooltip
                var tooltipNew = this._currentLine.getNewToolTip(e.latlng);
                tooltipNew.addTo(this._layerPaint);
                this._currentLine.tooltips.push(tooltipNew);
                this._currentLine.circleMarkers.last().unbindTooltip();   // remove popup-tooltip of previous, last circleMarker
                this._currentLine.circleMarkers.last().bindTooltip(this.options.tooltipTextMove + this.options.tooltipTextDelete, {direction: 'top', opacity: 0.7, className: 'polyline-measure-popupTooltip'});
                this._currentLine.circleMarkers.last().setStyle(this.options.currentCircle);
                this._cntCircle = this._currentLine.circleCoords.length;
            }
        },

        /**
         * After completing a path, reset all the values to prepare in creating the next polyline measurement
         * @private
         */
        _resetPathVariables: function () {
            this._cntCircle = 0;
            this._currentLine = null;
        },

        _clickedArrow: function (e) {
            if (e.originalEvent.ctrlKey) {
                var lineNr = e.target.cntLine;
                var arrowNr = e.target.cntArrow;
                this._arrPolylines[lineNr].arrowMarkers [arrowNr].removeFrom(this._layerPaint);
                var newCircleMarker = new L.CircleMarker(e.latlng, this.options.intermedCircle).addTo(this._layerPaint);
                newCircleMarker.cntLine = lineNr;
                newCircleMarker.on('mousedown', this._dragCircle, this);
                newCircleMarker.bindTooltip(this.options.tooltipTextMove + this.options.tooltipTextDelete, {direction: 'top', opacity: 0.7, className: 'polyline-measure-popupTooltip'});
                this._arrPolylines[lineNr].circleMarkers.splice(arrowNr + 1, 0, newCircleMarker);
                this._arrPolylines[lineNr].circleMarkers.map(function (item, index) {
                    item.cntCircle = index;
                });
                this._arrPolylines[lineNr].circleCoords.splice(arrowNr + 1, 0, e.latlng);
                lineCoords = this._arrPolylines[lineNr].polylinePath.getLatLngs(); // get Coords of each Point of the current Polyline
                var arc1 = this._polylineArc(this._arrPolylines[lineNr].circleCoords[arrowNr], e.latlng);
                arc1.pop();
                var arc2 = this._polylineArc(e.latlng, this._arrPolylines[lineNr].circleCoords[arrowNr + 2]);
                Array.prototype.splice.apply(lineCoords, [(arrowNr) * (this._arcpoints - 1), this._arcpoints].concat(arc1, arc2));
                this._arrPolylines[lineNr].polylinePath.setLatLngs(lineCoords);
                var arrowMarker = this._drawArrow(arc1);
                this._arrPolylines[lineNr].arrowMarkers[arrowNr] = arrowMarker;
                arrowMarker = this._drawArrow(arc2);
                this._arrPolylines[lineNr].arrowMarkers.splice(arrowNr + 1, 0, arrowMarker);
                this._arrPolylines[lineNr].arrowMarkers.map(function (item, index) {
                    item.cntLine = lineNr;
                    item.cntArrow = index;
                });
                this._tooltipNew = L.marker(e.latlng, {
                    icon: L.divIcon({
                        className: 'polyline-measure-tooltip',
                        iconAnchor: [-4, -4]
                    }),
                    interactive: false
                });
                this._tooltipNew.addTo(this._layerPaint);
                this._arrPolylines[lineNr].tooltips.splice(arrowNr + 1, 0, this._tooltipNew);
                var totalDistance = 0;
                this._arrPolylines[lineNr].tooltips.map(function (item, index) {
                    if (index >= 1) {
                        var distance = this._arrPolylines[lineNr].circleCoords[index - 1].distanceTo(this._arrPolylines[lineNr].circleCoords[index]);
                        var lastCircleCoords = this._arrPolylines[lineNr].circleCoords[index - 1];
                        var mouseCoords = this._arrPolylines[lineNr].circleCoords[index];
                        totalDistance += distance;
                        var prevTooltip = this._arrPolylines[lineNr].tooltips[index - 1]
                        this._updateTooltip(item, prevTooltip, totalDistance, distance, lastCircleCoords, mouseCoords);
                    }
                }.bind(this));
            }
        },

        _dragCircleMouseup: function () {
            // bind new popup-tooltip to the last CircleMArker if dragging finished
            if ((this._circleNr === 0) || (this._circleNr === this._arrPolylines[this._lineNr].circleCoords.length - 1)) {
                this._e1.target.bindTooltip(this.options.tooltipTextMove + this.options.tooltipTextDelete + this.options.tooltipTextResume, {direction: 'top', opacity: 0.7, className: 'polyline-measure-popupTooltip'});
            } else {
                this._e1.target.bindTooltip(this.options.tooltipTextMove + this.options.tooltipTextDelete, {direction: 'top', opacity: 0.7, className: 'polyline-measure-popupTooltip'});
            }
            this._resetPathVariables();
            this._map.off('mousemove', this._dragCircleMousemove, this);
            this._map.dragging.enable();
            this._map.on('mousemove', this._mouseMove, this);
            this._map.off('mouseup', this._dragCircleMouseup, this);
        },

        _dragCircleMousemove: function (e2) {
            var mouseNewLat = e2.latlng.lat;
            var mouseNewLng = e2.latlng.lng;
            var latDifference = mouseNewLat - this._mouseStartingLat;
            var lngDifference = mouseNewLng - this._mouseStartingLng;
            var currentCircleCoords = L.latLng(this._circleStartingLat + latDifference, this._circleStartingLng + lngDifference);
            var arcpoints = this._arcpoints;
            var lineNr = this._e1.target.cntLine;
            this._lineNr = lineNr;
            var circleNr = this._e1.target.cntCircle;
            this._circleNr = circleNr;
            this._e1.target.setLatLng(currentCircleCoords);
            this._e1.target.unbindTooltip();    // unbind popup-tooltip cause otherwise it would be annoying during dragging, or popup instantly again if it's just closed
            this._arrPolylines[lineNr].circleCoords[circleNr] = currentCircleCoords;
            var lineCoords = this._arrPolylines[lineNr].polylinePath.getLatLngs(); // get Coords of each Point of the current Polyline
            if (circleNr >= 1) {   // redraw previous arc just if circle is not starting circle of polyline
                var newLineSegment1 = this._polylineArc(this._arrPolylines[lineNr].circleCoords[circleNr - 1], currentCircleCoords);
                // the next line's syntax has to be used since Internet Explorer doesn't know new spread operator (...) for inserting the individual elements of an array as 3rd argument of the splice method; Otherwise we could write: lineCoords.splice (circleNr*(arcpoints-1), arcpoints, ...newLineSegment1);
                Array.prototype.splice.apply(lineCoords, [(circleNr - 1) * (arcpoints - 1), arcpoints].concat(newLineSegment1));
                var arrowMarker = this._drawArrow(newLineSegment1);
                arrowMarker.cntLine = lineNr;
                arrowMarker.cntArrow = circleNr - 1;
                this._arrPolylines[lineNr].arrowMarkers [circleNr - 1].removeFrom(this._layerPaint);
                this._arrPolylines[lineNr].arrowMarkers [circleNr - 1] = arrowMarker;
            }
            if (circleNr < this._arrPolylines[lineNr].circleCoords.length - 1) {   // redraw following arc just if circle is not end circle of polyline
                var newLineSegment2 = this._polylineArc(currentCircleCoords, this._arrPolylines[lineNr].circleCoords[circleNr + 1]);
                Array.prototype.splice.apply(lineCoords, [circleNr * (arcpoints - 1), arcpoints].concat(newLineSegment2));
                arrowMarker = this._drawArrow(newLineSegment2);
                arrowMarker.cntLine = lineNr;
                arrowMarker.cntArrow = circleNr;
                this._arrPolylines[lineNr].arrowMarkers [circleNr].removeFrom(this._layerPaint);
                this._arrPolylines[lineNr].arrowMarkers [circleNr] = arrowMarker;
            }
            this._arrPolylines[lineNr].polylinePath.setLatLngs(lineCoords);
            if (circleNr >= 0) {     // just update tooltip position if moved circle is 2nd, 3rd, 4th etc. circle of a polyline
                this._arrPolylines[lineNr].tooltips[circleNr].setLatLng(currentCircleCoords);
            }
            var totalDistance = 0;
            // update tooltip texts of each tooltip
            this._arrPolylines[lineNr].tooltips.map(function (item, index) {
                if (index >= 1) {
                    var distance = this._arrPolylines[lineNr].circleCoords[index - 1].distanceTo(this._arrPolylines[lineNr].circleCoords[index]);
                    var lastCircleCoords = this._arrPolylines[lineNr].circleCoords[index - 1];
                    var mouseCoords = this._arrPolylines[lineNr].circleCoords[index];
                    totalDistance += distance;
                    var prevTooltip = this._arrPolylines[lineNr].tooltips[index - 1]
                    this._updateTooltip(item, prevTooltip, totalDistance, distance, lastCircleCoords, mouseCoords);
                }
            }.bind(this));
            this._map.on('mouseup', this._dragCircleMouseup, this);
        },

        _resumeFirstpointMousemove: function (e) {
            var lineNr = this._lineNr;
            this._map.on('click', this._resumeFirstpointClick, this);  // necassary for _dragCircle. If switched on already within _dragCircle an unwanted click is fired at the end of the drag.
            var mouseCoords = e.latlng;
            this._rubberlinePath2.setLatLngs(this._polylineArc(mouseCoords, currentCircleCoords));
            this._tooltipNew.setLatLng(mouseCoords);
            var totalDistance = 0;
            var distance = mouseCoords.distanceTo(this._arrPolylines[lineNr].circleCoords[0]);
            var lastCircleCoords = mouseCoords;
            var currentCoords = this._arrPolylines[lineNr].circleCoords[0];
            totalDistance += distance;
            var prevTooltip = this._tooltipNew;
            var currentTooltip = this._arrPolylines[lineNr].tooltips[0]
            this._updateTooltip(currentTooltip, prevTooltip, totalDistance, distance, lastCircleCoords, currentCoords);
            this._arrPolylines[lineNr].tooltips.map(function (item, index) {
                if (index >= 1) {
                    var distance = this._arrPolylines[lineNr].circleCoords[index - 1].distanceTo(this._arrPolylines[lineNr].circleCoords[index]);
                    var lastCircleCoords = this._arrPolylines[lineNr].circleCoords[index - 1];
                    var mouseCoords = this._arrPolylines[lineNr].circleCoords[index];
                    totalDistance += distance;
                    var prevTooltip = this._arrPolylines[lineNr].tooltips[index - 1]
                    this._updateTooltip(item, prevTooltip, totalDistance, distance, lastCircleCoords, mouseCoords);
                }
            }.bind(this));
        },

        _resumeFirstpointClick: function (e) {
            var lineNr = this._lineNr;
            this._resumeFirstpointFlag = false;
            this._map.off('mousemove', this._resumeFirstpointMousemove, this);
            this._map.off('click', this._resumeFirstpointClick, this);
            this._layerPaint.removeLayer(this._rubberlinePath2);
            this._arrPolylines[lineNr].circleMarkers [0].setStyle(this.options.intermedCircle);
            this._arrPolylines[lineNr].circleMarkers [0].unbindTooltip();
            this._arrPolylines[lineNr].circleMarkers [0].bindTooltip(this.options.tooltipTextMove + this.options.tooltipTextDelete, {direction: 'top', opacity: 0.7, className: 'polyline-measure-popupTooltip'});
            var newCircleMarker = new L.CircleMarker(e.latlng, this.options.startCircle).addTo(this._layerPaint);
            newCircleMarker.cntLine = lineNr;
            newCircleMarker.cntCircle = 0;
            newCircleMarker.on('mousedown', this._dragCircle, this);
            newCircleMarker.bindTooltip(this.options.tooltipTextMove + this.options.tooltipTextDelete + this.options.tooltipTextResume, {direction: 'top', opacity: 0.7, className: 'polyline-measure-popupTooltip'});
            this._arrPolylines[lineNr].circleMarkers.unshift(newCircleMarker);
            this._arrPolylines[lineNr].circleMarkers.map(function (item, index) {
                item.cntCircle = index;
            });
            this._arrPolylines[lineNr].circleCoords.unshift(e.latlng);
            var arc = this._polylineArc(e.latlng, currentCircleCoords);
            var arrowMarker = this._drawArrow(arc);
            this._arrPolylines[lineNr].arrowMarkers.unshift(arrowMarker);
            this._arrPolylines[lineNr].arrowMarkers.map(function (item, index) {
                item.cntLine = lineNr;
                item.cntArrow = index;
            });
            arc.pop();  // remove last coordinate of arc, cause it's already part of the next arc.
            this._arrPolylines[lineNr].polylinePath.setLatLngs(arc.concat(this._arrPolylines[lineNr].polylinePath.getLatLngs()));
            this._arrPolylines[lineNr].tooltips.unshift(this._tooltipNew);
            this._map.on('mousemove', this._mouseMove, this);
        },

        // not just used for dragging Cirles but also for deleting circles and resuming line at its starting point.
        _dragCircle: function (e1) {
            var arcpoints = this._arcpoints;
            if (e1.originalEvent.ctrlKey) {   // if user wants to resume drawing a line
                this._map.off('click', this._mouseClick, this); // to avoid unwanted creation of a new line if CTRL-clicked onto a point
                // if user wants resume the line at its starting point
                if (e1.target.cntCircle === 0) {
                    this._resumeFirstpointFlag = true;
                    this._lineNr = e1.target.cntLine;
                    var lineNr = this._lineNr;
                    this._circleNr = e1.target.cntCircle;
                    currentCircleCoords = e1.latlng;
                    this._arrPolylines[lineNr].circleMarkers [0].setStyle(this.options.currentCircle);
                    this._rubberlinePath2 = L.polyline([], {
                        // Style of temporary, rubberline while moving the mouse
                        color: this.options.tempLine.color,
                        weight: this.options.tempLine.weight,
                        interactive: false,
                        dashArray: '8,8'
                    }).addTo(this._layerPaint).bringToBack();
                    this._tooltipNew = L.marker(currentCircleCoords, {
                        icon: L.divIcon({
                            className: 'polyline-measure-tooltip',
                            iconAnchor: [-4, -4]
                        }),
                        interactive: false
                    });
                    this._tooltipNew.addTo(this._layerPaint);
                    var text = '';
                    if (this.options.showBearings === true) {
                        text = text + this.options.bearingTextIn + ':---°<br>' + this.options.bearingTextOut + ':---°';
                    }
                    text = text + '<div class="polyline-measure-tooltip-difference">+' + '0</div>';
                    text = text + '<div class="polyline-measure-tooltip-total">' + '0</div>';
                    this._tooltipNew._icon.innerHTML = text;
                    this._map.off('mousemove', this._mouseMove, this);
                    this._map.on('mousemove', this._resumeFirstpointMousemove, this);
                }
                return;
            }

            // if user wants to delete a circle
            if (e1.originalEvent.shiftKey) {    // it's not possible to use "ALT-Key" instead, cause this won't work in some Linux distributions (there it's the default hotkey for moving windows)
                this._lineNr = e1.target.cntLine;
                var lineNr = this._lineNr;
                this._circleNr = e1.target.cntCircle;
                var circleNr = this._circleNr;

                // if there is a polyline with this number in finished ones
                if (this._arrPolylines[lineNr]) {
                    this._arrPolylines[lineNr].circleCoords.splice(circleNr, 1);
                    this._arrPolylines[lineNr].circleMarkers [circleNr].removeFrom(this._layerPaint);
                    this._arrPolylines[lineNr].circleMarkers.splice(circleNr, 1);
                    this._arrPolylines[lineNr].circleMarkers.map(function (item, index) {
                        item.cntCircle = index;
                    });
                    var lineCoords = this._arrPolylines[lineNr].polylinePath.getLatLngs();
                    this._arrPolylines[lineNr].tooltips [circleNr].removeFrom(this._layerPaint);
                    this._arrPolylines[lineNr].tooltips.splice(circleNr, 1);

                    // if the last Circle in polyline is being removed (in the code above, so length will be equal 0)
                    if (!this._arrPolylines[lineNr].circleMarkers.length) {
                        this._arrPolylines.splice(lineNr, 1);
                        // when you delete the line in the middle of array, other lines indexes change, so you need to update line number of markers and circles
                        this._arrPolylines.forEach(function (line, index) {
                            line.circleMarkers.map(function (item) {
                                item.cntLine = index;
                            });
                            line.arrowMarkers.map(function (item) {
                                item.cntLine = index;
                            });
                        });

                        return;
                    }
                    // if first Circle is being removed
                    if (circleNr === 0) {
                        this._arrPolylines[lineNr].circleMarkers [0].setStyle(this.options.startCircle);
                        lineCoords.splice(0, arcpoints - 1);
                        this._arrPolylines[lineNr].circleMarkers [0].bindTooltip(this.options.tooltipTextMove + this.options.tooltipTextDelete + this.options.tooltipTextResume, {direction: 'top', opacity: 0.7, className: 'polyline-measure-popupTooltip'});
                        this._arrPolylines[lineNr].arrowMarkers [circleNr].removeFrom(this._layerPaint);
                        this._arrPolylines[lineNr].arrowMarkers.splice(0, 1);
                        var text = '';
                        if (this.options.showBearings === true) {
                            text = this.options.bearingTextIn + ':---°<br>' + this.options.bearingTextOut + ':---°';
                        }
                        text = text + '<div class="polyline-measure-tooltip-difference">+' + '0</div>';
                        text = text + '<div class="polyline-measure-tooltip-total">' + '0</div>';
                        this._arrPolylines[lineNr].tooltips [0]._icon.innerHTML = text;
                        // if last Circle is being removed
                    } else if (circleNr === this._arrPolylines[lineNr].circleCoords.length) {
                        this._arrPolylines[lineNr].circleMarkers [circleNr - 1].on('click', this._resumePolylinePath, this);
                        this._arrPolylines[lineNr].circleMarkers [circleNr - 1].bindTooltip(this.options.tooltipTextMove + this.options.tooltipTextDelete + this.options.tooltipTextResume, {direction: 'top', opacity: 0.7, className: 'polyline-measure-popupTooltip'});
                        this._arrPolylines[lineNr].circleMarkers.slice(-1)[0].setStyle(this.options.endCircle);  // get last element of the array
                        this._arrPolylines[lineNr].tooltips.slice(-1)[0]._icon.classList.add('polyline-measure-tooltip-end');
                        lineCoords.splice(-(arcpoints - 1), arcpoints - 1);
                        this._arrPolylines[lineNr].arrowMarkers [circleNr - 1].removeFrom(this._layerPaint);
                        this._arrPolylines[lineNr].arrowMarkers.splice(-1, 1);
                        // if intermediate Circle is being removed
                    } else {
                        newLineSegment = this._polylineArc(this._arrPolylines[lineNr].circleCoords[circleNr - 1], this._arrPolylines[lineNr].circleCoords[circleNr]);
                        Array.prototype.splice.apply(lineCoords, [(circleNr - 1) * (arcpoints - 1), (2 * arcpoints - 1)].concat(newLineSegment));
                        this._arrPolylines[lineNr].arrowMarkers [circleNr - 1].removeFrom(this._layerPaint);
                        this._arrPolylines[lineNr].arrowMarkers [circleNr].removeFrom(this._layerPaint);
                        var arrowMarker = this._drawArrow(newLineSegment);
                        this._arrPolylines[lineNr].arrowMarkers.splice(circleNr - 1, 2, arrowMarker);
                    }
                    this._arrPolylines[lineNr].polylinePath.setLatLngs(lineCoords);
                    this._arrPolylines[lineNr].arrowMarkers.map(function (item, index) {
                        item.cntLine = lineNr;
                        item.cntArrow = index;
                    });
                    var totalDistance = 0;
                    this._arrPolylines[lineNr].tooltips.map(function (item, index) {
                        if (index >= 1) {
                            var distance = this._arrPolylines[lineNr].circleCoords[index - 1].distanceTo(this._arrPolylines[lineNr].circleCoords[index]);
                            var lastCircleCoords = this._arrPolylines[lineNr].circleCoords[index - 1];
                            var mouseCoords = this._arrPolylines[lineNr].circleCoords[index];
                            totalDistance += distance;
                            var prevTooltip = this._arrPolylines[lineNr].tooltips[index - 1];
                            this._updateTooltip(item, prevTooltip, totalDistance, distance, lastCircleCoords, mouseCoords);
                        }
                    }.bind(this));
                    // if this is the first line and it's not finished yet
                } else {
                    // when you're drawing and deleting point you need to take it into account by decreasing _cntCircle
                    this._cntCircle--;
                    // if the last Circle in polyline is being removed
                    if (this._currentLine.circleMarkers.length === 1) {
                        this._currentLine.finalize();
                        return;
                    }

                    this._currentLine.circleCoords.splice(circleNr, 1);
                    this._currentLine.circleMarkers [circleNr].removeFrom(this._layerPaint);
                    this._currentLine.circleMarkers.splice(circleNr, 1);
                    this._currentLine.circleMarkers.map(function (item, index) {
                        item.cntCircle = index;
                    });
                    lineCoords = this._currentLine.polylinePath.getLatLngs();
                    this._currentLine.tooltips [circleNr].removeFrom(this._layerPaint);
                    this._currentLine.tooltips.splice(circleNr, 1);

                    // if first Circle is being removed
                    if (circleNr === 0) {
                        if (this._currentLine.circleMarkers.length === 1) {
                            this._currentLine.circleMarkers [0].setStyle(this.options.currentCircle);
                        } else {
                            this._currentLine.circleMarkers [0].setStyle(this.options.startCircle);
                        }
                        lineCoords.splice(0, arcpoints - 1);
                        this._currentLine.circleMarkers [0].bindTooltip(this.options.tooltipTextMove + this.options.tooltipTextDelete + this.options.tooltipTextResume, {direction: 'top', opacity: 0.7, className: 'polyline-measure-popupTooltip'});
                        this._currentLine.arrowMarkers [circleNr].removeFrom(this._layerPaint);
                        this._currentLine.arrowMarkers.splice(0, 1);
                        var text = '';
                        if (this.options.showBearings === true) {
                            text = this.options.bearingTextIn + ':---°<br>' + this.options.bearingTextOut + ':---°';
                        }
                        text = text + '<div class="polyline-measure-tooltip-difference">+' + '0</div>';
                        text = text + '<div class="polyline-measure-tooltip-total">' + '0</div>';
                        this._currentLine.tooltips [0]._icon.innerHTML = text;
                        // if last Circle is being removed
                    } else if (circleNr === this._currentLine.circleCoords.length) {
                        this._currentLine.circleMarkers [circleNr - 1].on('click', this._resumePolylinePath, this);
                        this._currentLine.circleMarkers [circleNr - 1].bindTooltip(this.options.tooltipTextMove + this.options.tooltipTextDelete + this.options.tooltipTextResume, {direction: 'top', opacity: 0.7, className: 'polyline-measure-popupTooltip'});
                        this._currentLine.circleMarkers.slice(-1)[0].setStyle(this.options.currentCircle);  // get last element of the array
                        this._currentLine.tooltips.slice(-1)[0]._icon.classList.add('polyline-measure-tooltip-end');
                        lineCoords.splice(-(arcpoints - 1), arcpoints - 1);
                        this._currentLine.arrowMarkers [circleNr - 1].removeFrom(this._layerPaint);
                        this._currentLine.arrowMarkers.splice(-1, 1);
                        // if intermediate Circle is being removed
                    } else {
                        newLineSegment = this._polylineArc(this._currentLine.circleCoords[circleNr - 1], this._currentLine.circleCoords[circleNr]);
                        Array.prototype.splice.apply(lineCoords, [(circleNr - 1) * (arcpoints - 1), (2 * arcpoints - 1)].concat(newLineSegment));
                        this._currentLine.arrowMarkers [circleNr - 1].removeFrom(this._layerPaint);
                        this._currentLine.arrowMarkers [circleNr].removeFrom(this._layerPaint);
                        arrowMarker = this._drawArrow(newLineSegment);
                        this._currentLine.arrowMarkers.splice(circleNr - 1, 2, arrowMarker);
                    }
                    this._currentLine.polylinePath.setLatLngs(lineCoords);
                    this._currentLine.arrowMarkers.map(function (item, index) {
                        item.cntLine = lineNr;
                        item.cntArrow = index;
                    });
                    var totalDistanceUnfinishedLine = 0;
                    this._currentLine.tooltips.map(function (item, index, arr) {
                        if (index >= 1) {
                            var distance, mouseCoords;
                            var prevTooltip = this._currentLine.tooltips[index - 1];
                            var lastCircleCoords = this._currentLine.circleCoords[index - 1];
                            if (index === arr.length - 1) {
                                distance = this._currentLine.circleCoords[index - 1].distanceTo(e1.latlng);
                                mouseCoords = e1.latlng;
                                // if this is the last Circle (mouse cursor) then don't sum the distance, but update tooltip like it was summed
                                this._updateTooltip(item, prevTooltip, totalDistanceUnfinishedLine + distance, distance, lastCircleCoords, mouseCoords);
                            } else {
                                distance = this._currentLine.circleCoords[index - 1].distanceTo(this._currentLine.circleCoords[index]);
                                mouseCoords = this._currentLine.circleCoords[index];
                                // if this is not the last Circle (mouse cursor) then sum the distance
                                totalDistanceUnfinishedLine += distance;
                                this._updateTooltip(item, prevTooltip, totalDistanceUnfinishedLine, distance, lastCircleCoords, mouseCoords);
                            }
                        }
                    }.bind(this));

                    // update _currentLine distance after point deletion
                    this._currentLine.distance = totalDistanceUnfinishedLine;
                }

                return;
            }
            this._e1 = e1;
            if ((this._measuring) && (this._cntCircle === 0)) {    // just execute drag-function if Measuring tool is active but no line is being drawn at the moment.
                this._map.dragging.disable();  // turn of moving of the map during drag of a circle
                this._map.off('mousemove', this._mouseMove, this);
                this._map.off('click', this._mouseClick, this);
                this._mouseStartingLat = e1.latlng.lat;
                this._mouseStartingLng = e1.latlng.lng;
                this._circleStartingLat = e1.target._latlng.lat;
                this._circleStartingLng = e1.target._latlng.lng;
                this._map.on('mousemove', this._dragCircleMousemove, this);
            }
        }
    });

//======================================================================================

    L.Map.mergeOptions({
        PolylineMeasureControl: false
    });

    L.Map.addInitHook(function () {
        if (this.options.polylineMeasureControl) {
            this.PMControl = new L.Control.PolylineMeasure();
            this.addControl(this.PMControl);
        }
    });

    L.control.polylineMeasure = function (options) {
        return new L.Control.PolylineMeasure(options);
    };

    return L.Control.PolylineMeasure;
    // to allow
    // import PolylineMeasure from 'leaflet.polylinemeasure';
    // const measureControl = new PolylineMeasure();
    // together with
    // import 'leaflet.polylinemeasure';
    // const measureControl = new L.Control.PolylineMeasure();

}));