import * as React from 'react';
import { useState } from 'react';
import { useControl, Marker } from 'react-map-gl';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

/* eslint-disable complexity,max-statements */
export default function GeocoderControl(props) {
    const [marker, setMarker] = useState<React.ReactNode>(null);
    const geocoder = useControl(() => {
        const ctrl = new MapboxGeocoder(Object.assign(Object.assign({}, props), { marker: false, accessToken: props.mapboxAccessToken }));
        ctrl.on('loading', props.onLoading);
        ctrl.on('results', props.onResults);
        ctrl.on('result', evt => {
            var _a;
            props.onResult(evt);
            const { result } = evt;
            const location = result &&
                (result.center || (((_a = result.geometry) === null || _a === void 0 ? void 0 : _a.type) === 'Point' && result.geometry.coordinates));
            if (location && props.marker) {
                const newMarker = <Marker {...props.marker} longitude={location[0]} latitude={location[1]} />;
                setMarker(() => newMarker);
            }
            else {
                setMarker(() => null);
            }
        });
        ctrl.on('error', props.onError);
        return ctrl;
    }, {
        position: props.position
    });
    
    // @ts-ignore (TS2339) private member
    if (geocoder._map) {
        if (geocoder.getProximity() !== props.proximity && props.proximity !== undefined) {
            geocoder.setProximity(props.proximity);
        }
        if (geocoder.getRenderFunction() !== props.render && props.render !== undefined) {
            geocoder.setRenderFunction(props.render);
        }
        if (geocoder.getLanguage() !== props.language && props.language !== undefined) {
            geocoder.setLanguage(props.language);
        }
        if (geocoder.getZoom() !== props.zoom && props.zoom !== undefined) {
            geocoder.setZoom(props.zoom);
        }
        if (geocoder.getFlyTo() !== props.flyTo && props.flyTo !== undefined) {
            geocoder.setFlyTo(props.flyTo);
        }
        if (geocoder.getPlaceholder() !== props.placeholder && props.placeholder !== undefined) {
            geocoder.setPlaceholder(props.placeholder);
        }
        if (geocoder.getCountries() !== props.countries && props.countries !== undefined) {
            geocoder.setCountries(props.countries);
        }
        if (geocoder.getTypes() !== props.types && props.types !== undefined) {
            geocoder.setTypes(props.types);
        }
        if (geocoder.getMinLength() !== props.minLength && props.minLength !== undefined) {
            geocoder.setMinLength(props.minLength);
        }
        if (geocoder.getLimit() !== props.limit && props.limit !== undefined) {
            geocoder.setLimit(props.limit);
        }
        if (geocoder.getFilter() !== props.filter && props.filter !== undefined) {
            geocoder.setFilter(props.filter);
        }
        if (geocoder.getOrigin() !== props.origin && props.origin !== undefined) {
            geocoder.setOrigin(props.origin);
        }
    }
    return marker;
}
const noop = () => { };
GeocoderControl.defaultProps = {
    marker: true,
    onLoading: noop,
    onResults: noop,
    onResult: noop,
    onError: noop
};