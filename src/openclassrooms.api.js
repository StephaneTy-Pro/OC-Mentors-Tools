

/*****
 *
 * FILE: /tmp/_openclassroom.api.umd.js
 * Generated at	
 * 	(fr)		lundi 22 avril 2024
 */

// ------------------------------------------------------------------- READAXIOS

/*
 * SRC: https://raw.githubusercontent.com/developit/redaxios/master/src/index.js
 */
/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @public
 * @typedef Options
 * @property {string} [url] the URL to request
 * @property {'get'|'post'|'put'|'patch'|'delete'|'options'|'head'|'GET'|'POST'|'PUT'|'PATCH'|'DELETE'|'OPTIONS'|'HEAD'} [method="get"] HTTP method, case-insensitive
 * @property {RequestHeaders} [headers] Request headers
 * @property {FormData|string|object} [body] a body, optionally encoded, to send
 * @property {'text'|'json'|'stream'|'blob'|'arrayBuffer'|'formData'|'stream'} [responseType="json"] An encoding to use for the response
 * @property {Record<string,any>|URLSearchParams} [params] querystring parameters
 * @property {(params: Options['params']) => string} [paramsSerializer] custom function to stringify querystring parameters
 * @property {boolean} [withCredentials] Send the request with credentials like cookies
 * @property {string} [auth] Authorization header value to send with the request
 * @property {string} [xsrfCookieName] Pass an Cross-site Request Forgery prevention cookie value as a header defined by `xsrfHeaderName`
 * @property {string} [xsrfHeaderName] The name of a header to use for passing XSRF cookies
 * @property {(status: number) => boolean} [validateStatus] Override status code handling (default: 200-399 is a success)
 * @property {Array<(body: any, headers?: RequestHeaders) => any?>} [transformRequest] An array of transformations to apply to the outgoing request
 * @property {string} [baseURL] a base URL from which to resolve all URLs
 * @property {typeof window.fetch} [fetch] Custom window.fetch implementation
 * @property {any} [data]
 */

/**
 * @public
 * @typedef RequestHeaders
 * @type {{[name: string]: string} | Headers}
 */

/**
 * @public
 * @template T
 * @typedef Response
 * @property {number} status
 * @property {string} statusText
 * @property {Options} config the request configuration
 * @property {T} data the decoded response body
 * @property {Headers} headers
 * @property {boolean} redirect
 * @property {string} url
 * @property {ResponseType} type
 * @property {ReadableStream<Uint8Array> | null} body
 * @property {boolean} bodyUsed
 */

/**
 * @typedef BodylessMethod
 * @type {<T=any>(url: string, config?: Options) => Promise<Response<T>>}
 */

/**
 * @typedef BodyMethod
 * @type {<T=any>(url: string, body?: any, config?: Options) => Promise<Response<T>>}
 */

/**
 * @public
 * @param {Options} [defaults = {}]
 * @returns {redaxios}
 */
function create(defaults) {
	defaults = defaults || {};

	/**
	 * @public
	 * @template T
	 * @type {(<T = any>(config?: Options) => Promise<Response<T>>) | (<T = any>(url: string, config?: Options) => Promise<Response<T>>)}
	 */
	redaxios.request = redaxios;

	/** @public @type {BodylessMethod} */
	redaxios.get = (url, config) => redaxios(url, config, 'get');

	/** @public @type {BodylessMethod} */
	redaxios.delete = (url, config) => redaxios(url, config, 'delete');

	/** @public @type {BodylessMethod} */
	redaxios.head = (url, config) => redaxios(url, config, 'head');

	/** @public @type {BodylessMethod} */
	redaxios.options = (url, config) => redaxios(url, config, 'options');

	/** @public @type {BodyMethod} */
	redaxios.post = (url, data, config) => redaxios(url, config, 'post', data);

	/** @public @type {BodyMethod} */
	redaxios.put = (url, data, config) => redaxios(url, config, 'put', data);

	/** @public @type {BodyMethod} */
	redaxios.patch = (url, data, config) => redaxios(url, config, 'patch', data);

	/** @public */
	redaxios.all = Promise.all.bind(Promise);

	/**
	 * @public
	 * @template Args, R
	 * @param {(...args: Args[]) => R} fn
	 * @returns {(array: Args[]) => R}
	 */
	redaxios.spread = (fn) => /** @type {any} */ (fn.apply.bind(fn, fn));

	/**
	 * @private
	 * @template T, U
	 * @param {T} opts
	 * @param {U} [overrides]
	 * @param {boolean} [lowerCase]
	 * @returns {{} & (T | U)}
	 */
	function deepMerge(opts, overrides, lowerCase) {
		let out = /** @type {any} */ ({}),
			i;
		if (Array.isArray(opts)) {
			// @ts-ignore
			return opts.concat(overrides);
		}
		for (i in opts) {
			const key = lowerCase ? i.toLowerCase() : i;
			out[key] = opts[i];
		}
		for (i in overrides) {
			const key = lowerCase ? i.toLowerCase() : i;
			const value = /** @type {any} */ (overrides)[i];
			out[key] = key in out && typeof value == 'object' ? deepMerge(out[key], value, key == 'headers') : value;
		}
		return out;
	}

	/**
	 * Issues a request.
	 * @public
	 * @template T
	 * @param {string | Options} urlOrConfig
	 * @param {Options} [config = {}]
	 * @param {any} [_method] (internal)
	 * @param {any} [data] (internal)
	 * @param {never} [_undefined] (internal)
	 * @returns {Promise<Response<T>>}
	 */
	function redaxios(urlOrConfig, config, _method, data, _undefined) {
		let url = /** @type {string} */ (typeof urlOrConfig != 'string' ? (config = urlOrConfig).url : urlOrConfig);

		const response = /** @type {Response<any>} */ ({ config });

		/** @type {Options} */
		const options = deepMerge(defaults, config);

		/** @type {RequestHeaders} */
		const customHeaders = {};

		data = data || options.data;

		(options.transformRequest || []).map((f) => {
			data = f(data, options.headers) || data;
		});

		if (options.auth) {
			customHeaders.authorization = options.auth;
		}

		if (data && typeof data === 'object' && typeof data.append !== 'function' && typeof data.text !== 'function') {
			data = JSON.stringify(data);
			customHeaders['content-type'] = 'application/json';
		}

		try {
			// @ts-ignore providing the cookie name without header name is nonsensical anyway
			customHeaders[options.xsrfHeaderName] = decodeURIComponent(
				// @ts-ignore accessing match()[2] throws for no match, which is intentional
				document.cookie.match(RegExp('(^|; )' + options.xsrfCookieName + '=([^;]*)'))[2]
			);
		} catch (e) {}

		if (options.baseURL) {
			url = url.replace(/^(?!.*\/\/)\/?/, options.baseURL + '/');
		}

		if (options.params) {
			url +=
				(~url.indexOf('?') ? '&' : '?') +
				(options.paramsSerializer ? options.paramsSerializer(options.params) : new URLSearchParams(options.params));
		}

		const fetchFunc = options.fetch || fetch;

		return fetchFunc(url, {
			method: (_method || options.method || 'get').toUpperCase(),
			body: data,
			headers: deepMerge(options.headers, customHeaders, true),
			credentials: options.withCredentials ? 'include' : _undefined
		}).then((res) => {
			for (const i in res) {
				if (typeof res[i] != 'function') response[i] = res[i];
			}

			if (options.responseType == 'stream') {
				response.data = res.body;
				return response;
			}

			return res[options.responseType || 'text']()
				.then((data) => {
					response.data = data;
					// its okay if this fails: response.data will be the unparsed value:
					response.data = JSON.parse(data);
				})
				.catch(Object)
				.then(() => {
					const ok = options.validateStatus ? options.validateStatus(res.status) : res.ok;
					return ok ? response : Promise.reject(response);
				});
		});
	}

	/**
	 * @public
	 * @type {AbortController}
	 */
	redaxios.CancelToken = /** @type {any} */ (typeof AbortController == 'function' ? AbortController : Object);

	/**
	 * @public
	 * @type {Options}
	 */
	redaxios.defaults = defaults;

	/**
	 * @public
	 */
	redaxios.create = create;

	return redaxios;
}

//export default create();

// ------------------------------------------------------------- XHR INTERCEPTOR

/**
 *  FileName  	xhr_interceptor-nolibs.js
 *  Version: 	1.1
 */

/* ----------------------------------------------------------- DEPENDENCIES --*/
/*
 * AXIOS  https://github.com/developit/redaxios/blob/master/src/index.js
 */

// ---------------------------------------------------------------------- HEADER
const XHRInterceptor_h = {
	 NAME:   'XHRInterceptor'
	,VERSION:'202404.001'
	,EVENT: {
		OPEN:					"xhrinterceptor::open"
		,ONREADYSTATECHANGED:	"xhrinterceptor::onReadyStateChanged"
		,SEND:					"xhrinterceptor::send"
		,COMPLETE: 				"xhrinterceptor::complete"
	}
};

/*
 * Usage:
 * 	const xhrPatching = createXHRInterceptor({ enabled: true });
 */

function createXHRInterceptor (loggingOptions = {}, header=XHRInterceptor_h) {

	const XHRInterceptor = {};
	// Store for values like authorization bearer
	const valueStore = {};

	//const MODULE_HEADER = 'XHRInterceptor';
	const MODULE_HEADER = header.NAME;
	// EVENTS
	const EVT_OPEN = header.EVENT.OPEN;
	const EVT_ONREADYSTATECHANGED = header.EVENT.ONREADYSTATECHANGED;
	const EVT_SEND = header.EVENT.SEND;
	const EVT_COMPLETE = header.EVENT.COMPLETE;

	// Buffered logging function
	const buffer = [];

	// Save the originals methods
	XHRInterceptor.saved = {
		open: XMLHttpRequest.prototype.open,
		send: XMLHttpRequest.prototype.send,
		setRequestHeader: XMLHttpRequest.prototype.setRequestHeader,
	}

	// helper to keed a buffered log
	const log = (message) => {
		if (loggingOptions.enabled) {
			buffer.push(message);
		}
	};

	// helper to flush the buffered log
	const flushBuffer = () => {
		if (buffer.length > 0) {
			console.log(`[${MODULE_HEADER} Patching Log]:\n`, buffer.join('\n'));
			buffer.length = 0; // Clear the buffer
		}
	};

	/**
	* Helper function to wrap a function with a hook before executing the original function.
	*
	* @param {Function} originalFn - The original function to be wrapped.
	* @param {Function} hookFn - The hook function to be executed before the original function.
	* @returns {Function} - The wrapped function.
	*/
	function withHookBefore(originalFn = () => undefined , hookFn) {
		let bVerbose = false;
		return function () {
			if (hookFn.apply(this, arguments) === false) {
				return;
			}
		if (originalFn === null){
			if(bVerbose){ console.warn(`[${MODULE_HEADER}] withHookBefore originalFn is ${originalFn}, must return`); }
			return; // NOTESTT: sometimes function could be null
		 }
		return originalFn.apply(this, arguments);
		};
	}

	/**
	* Patched XHR open method with logging functionality.
	*
	* @param {Function} originalOpen - The original XHR open method.
	* @returns {Function} - The patched open method.
	*/
	XHRInterceptor.patchXHROpen = function (originalOpen) {
		let bVerbose = false;
		return function (method, url, async, user, password) {
			if(bVerbose){console.log(`[${MODULE_HEADER}] Request sent: ${method} ${url}`);}
			log(`[${MODULE_HEADER}] Request sent: ${method} ${url}`);
			return originalOpen.apply(this, arguments);
		};
	}

	/**
	* Patched XHR send method with logging functionality.
	*
	* @param {Function} originalSend - The original XHR send method.
	* @returns {Function} - The patched send method.
	*/

	XHRInterceptor.patchXHRSend = function (originalSend) {
		let bVerbose = false;
		return function (data) {
			const xhr = this;
			const originalOnReadyStateChange = xhr.onreadystatechange; // because this function could already be patched

			if(bVerbose){ console.log(`[${MODULE_HEADER}] patchXHRSendest sent: ${data}`);}
			log(`[${MODULE_HEADER}] patchXHRSend sent: ${data}}`);

			xhr.onreadystatechange = withHookBefore(originalOnReadyStateChange, function () {
				if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status <= 300) {

					if(bVerbose){ console.log(`[${MODULE_HEADER}] all is right returned data is:${xhr.responseText}`);}
					// NOTESTT: send an event to document, list is on header
					const event = new CustomEvent(EVT_COMPLETE, {
						detail: {
							request: xhr,
						response: xhr.responseText,
						},
					});
					document.dispatchEvent(event);
					// flush buffer and so eventually log all actions
					flushBuffer();
				}
			});

			return originalSend.apply(this, arguments);
		};

	}

	/**
	* Patched XHR setRequestHeader method with logging functionality.
	*
	* @param {Function} originalSetRequestHeader - The original XHR setRequestHeader method.
	* @returns {Function} - The patched setRequestHeader method.
	*/
	XHRInterceptor.patchXHRSetRequestHeader = function (originalSetRequestHeader) {
		let bVerbose = false;
		return function (header, value) {
			// authorization bearer save
			if (header.toLowerCase() === 'authorization' && value.startsWith('Bearer ')) {
				const domain = window.location.hostname;
				valueStore[domain] = value;
				if(bVerbose){ console.log(`[${MODULE_HEADER}] !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Store authorization bearer: ${domain}: ${value}`); }
			}

		if(bVerbose){ console.log(`[${MODULE_HEADER}] Set request header: ${header}: ${value}`); }
		log(`[${MODULE_HEADER}] Set request header: ${header}: ${value}`);

		return originalSetRequestHeader.apply(this, arguments);
		};
	};

	/**
	 * Patched Fetch method with logging functionality.
	 *
	 * @param {Function} originalFetch - The original Fetch method.
	 * @returns {Function} - The patched Fetch method.
	 */
	XHRInterceptor.patchFetch = function (originalFetch) {
		let bVerbose = false;
		return function (input, init) {
			if(bVerbose){ console.log(`[${MODULE_HEADER} Fetch] Request sent: ${input}`); }
			log(`[${MODULE_HEADER} Fetch] Request sent: ${input}`);

			let domain;
			try {
				domain = new URL(input).hostname;
			} catch (error) {
				domain = window.location.hostname;
			}
			if (valueStore[domain] && init && init.headers) {
				init.headers.append('Authorization', valueStore[domain]);
			}

			return originalFetch.apply(this, [input, init]).then(function (response) {
				if(bVerbose){ console.log(`[${MODULE_HEADER} Fetch] Response received: ${response}`); }
				log(`[${MODULE_HEADER} Fetch] Response received: ${response}`);
				return response;
			});
		};
	};

	XHRInterceptor.setBearer = function(domain){
		let bVerbose = false;
		if(bVerbose){ console.log("[%s:setBearer] of domain: %s in valueStore %o", MODULE_HEADER, domain, valueStore); }
		return valueStore[domain]
	}

	XHRInterceptor.getBearer = function(domain){
		let bVerbose = false;
		if(bVerbose){ console.log("[%s:getBearer] of domain:%s in valueStore %o", MODULE_HEADER, domain, valueStore); }
		return valueStore[domain] ? valueStore[domain] : null;
	}

	XHRInterceptor.restore = function(){
		XMLHttpRequest.prototype.open = XHRInterceptor.saved.open
		XMLHttpRequest.prototype.send = XHRInterceptor.saved.send
		XMLHttpRequest.prototype.setRequestHeader= XHRInterceptor.saved.setRequestHeader
	}

	// Patch XMLHttpRequest prototype
	XMLHttpRequest.prototype.open = XHRInterceptor.patchXHROpen(XMLHttpRequest.prototype.open);
	XMLHttpRequest.prototype.send = XHRInterceptor.patchXHRSend(XMLHttpRequest.prototype.send);
	XMLHttpRequest.prototype.setRequestHeader = XHRInterceptor.patchXHRSetRequestHeader(XMLHttpRequest.prototype.setRequestHeader);

	// Patch Fetch API prototype
	if (window.fetch) {
		const originalFetch = window.fetch;
		window.fetch = XHRInterceptor.patchFetch(originalFetch);
	}

	// Flush buffer on page unload
	window.addEventListener('unload', flushBuffer);

	// Flush buffer after a specified timeout
	const flushTimeout = loggingOptions.bufferTimeout || 5000; // Default timeout: 5 seconds
	setTimeout(flushBuffer, flushTimeout);
	return XHRInterceptor;

}

const interceptor = createXHRInterceptor();
interceptor.patchXHROpen(XMLHttpRequest.prototype.open);
interceptor.patchXHRSend(XMLHttpRequest.prototype.send);
interceptor.patchXHRSetRequestHeader(XMLHttpRequest.prototype.setRequestHeader);
if (window.fetch) interceptor.patchFetch(window.fetch);

/* ------------------------------------------------------------------ TESTS --*/
/*
// *********** TESTS
// -- BEFORE
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://jsonplaceholder.typicode.com/posts/1');
xhr.send();

var interceptor = createXHRInterceptor();
interceptor.patchXHROpen(XMLHttpRequest.prototype.open);
interceptor.patchXHRSend(XMLHttpRequest.prototype.send);
interceptor.patchXHRSetRequestHeader(XMLHttpRequest.prototype.setRequestHeader);
if (window.fetch) interceptor.patchFetch(window.fetch);

// -- AFTER
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://jsonplaceholder.typicode.com/posts/2');
xhr.send();

interceptor.restore()
*/

// ----------------------------------------------------------------------- DAYJS

!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).dayjs=e()}(this,(function(){"use strict";var t=1e3,e=6e4,n=36e5,r="millisecond",i="second",s="minute",u="hour",a="day",o="week",c="month",f="quarter",h="year",d="date",l="Invalid Date",$=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,M={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],n=t%100;return"["+t+(e[(n-20)%10]||e[n]||e[0])+"]"}},m=function(t,e,n){var r=String(t);return!r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},v={s:m,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return(e<=0?"+":"-")+m(r,2,"0")+":"+m(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return-t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,c),s=n-i<0,u=e.clone().add(r+(s?-1:1),c);return+(-(r+(n-i)/(s?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return{M:c,y:h,w:o,d:a,D:d,h:u,m:s,s:i,ms:r,Q:f}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},g="en",D={};D[g]=M;var p="$isDayjsObject",S=function(t){return t instanceof _||!(!t||!t[p])},w=function t(e,n,r){var i;if(!e)return g;if("string"==typeof e){var s=e.toLowerCase();D[s]&&(i=s),n&&(D[s]=n,i=s);var u=e.split("-");if(!i&&u.length>1)return t(u[0])}else{var a=e.name;D[a]=e,i=a}return!r&&i&&(g=i),i||!r&&g},O=function(t,e){if(S(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new _(n)},b=v;b.l=w,b.i=S,b.w=function(t,e){return O(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var _=function(){function M(t){this.$L=w(t.locale,null,!0),this.parse(t),this.$x=this.$x||t.x||{},this[p]=!0}var m=M.prototype;return m.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(b.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match($);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.init()},m.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds()},m.$utils=function(){return b},m.isValid=function(){return!(this.$d.toString()===l)},m.isSame=function(t,e){var n=O(t);return this.startOf(e)<=n&&n<=this.endOf(e)},m.isAfter=function(t,e){return O(t)<this.startOf(e)},m.isBefore=function(t,e){return this.endOf(e)<O(t)},m.$g=function(t,e,n){return b.u(t)?this[e]:this.set(n,t)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(t,e){var n=this,r=!!b.u(e)||e,f=b.p(t),l=function(t,e){var i=b.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(a)},$=function(t,e){return b.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},y=this.$W,M=this.$M,m=this.$D,v="set"+(this.$u?"UTC":"");switch(f){case h:return r?l(1,0):l(31,11);case c:return r?l(1,M):l(0,M+1);case o:var g=this.$locale().weekStart||0,D=(y<g?y+7:y)-g;return l(r?m-D:m+(6-D),M);case a:case d:return $(v+"Hours",0);case u:return $(v+"Minutes",1);case s:return $(v+"Seconds",2);case i:return $(v+"Milliseconds",3);default:return this.clone()}},m.endOf=function(t){return this.startOf(t,!1)},m.$set=function(t,e){var n,o=b.p(t),f="set"+(this.$u?"UTC":""),l=(n={},n[a]=f+"Date",n[d]=f+"Date",n[c]=f+"Month",n[h]=f+"FullYear",n[u]=f+"Hours",n[s]=f+"Minutes",n[i]=f+"Seconds",n[r]=f+"Milliseconds",n)[o],$=o===a?this.$D+(e-this.$W):e;if(o===c||o===h){var y=this.clone().set(d,1);y.$d[l]($),y.init(),this.$d=y.set(d,Math.min(this.$D,y.daysInMonth())).$d}else l&&this.$d[l]($);return this.init(),this},m.set=function(t,e){return this.clone().$set(t,e)},m.get=function(t){return this[b.p(t)]()},m.add=function(r,f){var d,l=this;r=Number(r);var $=b.p(f),y=function(t){var e=O(l);return b.w(e.date(e.date()+Math.round(t*r)),l)};if($===c)return this.set(c,this.$M+r);if($===h)return this.set(h,this.$y+r);if($===a)return y(1);if($===o)return y(7);var M=(d={},d[s]=e,d[u]=n,d[i]=t,d)[$]||1,m=this.$d.getTime()+r*M;return b.w(m,this)},m.subtract=function(t,e){return this.add(-1*t,e)},m.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||l;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=b.z(this),s=this.$H,u=this.$m,a=this.$M,o=n.weekdays,c=n.months,f=n.meridiem,h=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].slice(0,s)},d=function(t){return b.s(s%12||12,t,"0")},$=f||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r};return r.replace(y,(function(t,r){return r||function(t){switch(t){case"YY":return String(e.$y).slice(-2);case"YYYY":return b.s(e.$y,4,"0");case"M":return a+1;case"MM":return b.s(a+1,2,"0");case"MMM":return h(n.monthsShort,a,c,3);case"MMMM":return h(c,a);case"D":return e.$D;case"DD":return b.s(e.$D,2,"0");case"d":return String(e.$W);case"dd":return h(n.weekdaysMin,e.$W,o,2);case"ddd":return h(n.weekdaysShort,e.$W,o,3);case"dddd":return o[e.$W];case"H":return String(s);case"HH":return b.s(s,2,"0");case"h":return d(1);case"hh":return d(2);case"a":return $(s,u,!0);case"A":return $(s,u,!1);case"m":return String(u);case"mm":return b.s(u,2,"0");case"s":return String(e.$s);case"ss":return b.s(e.$s,2,"0");case"SSS":return b.s(e.$ms,3,"0");case"Z":return i}return null}(t)||i.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(r,d,l){var $,y=this,M=b.p(d),m=O(r),v=(m.utcOffset()-this.utcOffset())*e,g=this-m,D=function(){return b.m(y,m)};switch(M){case h:$=D()/12;break;case c:$=D();break;case f:$=D()/3;break;case o:$=(g-v)/6048e5;break;case a:$=(g-v)/864e5;break;case u:$=g/n;break;case s:$=g/e;break;case i:$=g/t;break;default:$=g}return l?$:b.a($)},m.daysInMonth=function(){return this.endOf(c).$D},m.$locale=function(){return D[this.$L]},m.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=w(t,e,!0);return r&&(n.$L=r),n},m.clone=function(){return b.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},M}(),k=_.prototype;return O.prototype=k,[["$ms",r],["$s",i],["$m",s],["$H",u],["$W",a],["$M",c],["$y",h],["$D",d]].forEach((function(t){k[t[1]]=function(e){return this.$g(e,t[0],t[1])}})),O.extend=function(t,e){return t.$i||(t(e,_,O),t.$i=!0),O},O.locale=w,O.isDayjs=S,O.unix=function(t){return O(1e3*t)},O.en=D[g],O.Ls=D,O.p={},O}));
// ------------------------------------------------------------- DAYJS PLUGIN --

!function(e,i){"object"==typeof exports&&"undefined"!=typeof module?module.exports=i():"function"==typeof define&&define.amd?define(i):(e="undefined"!=typeof globalThis?globalThis:e||self).dayjs_plugin_isSameOrBefore=i()}(this,(function(){"use strict";return function(e,i){i.prototype.isSameOrBefore=function(e,i){return this.isSame(e,i)||this.isBefore(e,i)}}}));

dayjs.extend(dayjs_plugin_isSameOrBefore);
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).dayjs_plugin_isSameOrAfter=t()}(this,(function(){"use strict";return function(e,t){t.prototype.isSameOrAfter=function(e,t){return this.isSame(e,t)||this.isAfter(e,t)}}}));

dayjs.extend(dayjs_plugin_isSameOrAfter);
// ------------------------------------------------------------ DAYJS LOCALES --

!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?module.exports=n(require("dayjs")):"function"==typeof define&&define.amd?define(["dayjs"],n):(e="undefined"!=typeof globalThis?globalThis:e||self).dayjs_locale_fr=n(e.dayjs)}(this,(function(e){"use strict";function n(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var t=n(e),i={name:"fr",weekdays:"dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),weekdaysShort:"dim._lun._mar._mer._jeu._ven._sam.".split("_"),weekdaysMin:"di_lu_ma_me_je_ve_sa".split("_"),months:"janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),monthsShort:"janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),weekStart:1,yearStart:4,formats:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd D MMMM YYYY HH:mm"},relativeTime:{future:"dans %s",past:"il y a %s",s:"quelques secondes",m:"une minute",mm:"%d minutes",h:"une heure",hh:"%d heures",d:"un jour",dd:"%d jours",M:"un mois",MM:"%d mois",y:"un an",yy:"%d ans"},ordinal:function(e){return""+e+(1===e?"er":"")}};return t.default.locale(i,null,!0),i}));
// activate fr as locale
dayjs.locale('fr');
// ------------------------------------------------------------ HELPER ASSERTION



/*
 * Performs an assertion.
 * @ignore
 *
 * @param  {Boolean} condition - The expression to assert.
 * @param  {String}  errorMessage - The message to throw if the assertion fails
 * @param  {ErrorConstructor}   [ErrorType=Error] - The error to throw if the assertion fails.
 *
 * @throws {Error} If `condition` returns `false`.
 *
 * SRC : https://github.com/dinerojs/dinero.js/blob/develop/src/services/assert.js
 *
 * USAGE
 *
 *   assert(
    isPercentage(percentage),
    'You must provide a numeric value between 0 and 100.',
    RangeError
  )
 *
 * RangeError, TypeError
 *
 */
const assert = function (condition, errorMessage, ErrorType = Error) {
  if (!condition) throw new ErrorType(errorMessage)
}

// create namespace
const test = {assert:assert}
// ------------------------------------------------------------------- CONSTANTS

const C = {
	APP_DEBUG_STYLE: [
		"color: #373737",
		"background-color: #CC6",
		"padding: 2px 4px",
		"border-radius: 2px"
	].join(";"),
	APP_WARN_STYLE: [
		"color: yellow",
		"background-color: #CC6",
		"padding: 2px 4px",
		"border-radius: 2px"
	].join(";"),
	APP_ERROR_STYLE: [
		"color: red",
		"background-color: #CC6",
		"padding: 2px 4px",
		"border-radius: 2px"
	].join(";"),
	APP_INFO_STYLE: [
		"color: cyan",
		"background-color: #CC6",
		"padding: 2px 4px",
		"border-radius: 2px"
	].join(";"),
}

// ----------------------------------------------------------- OPENCLASSROOMSAPI
// ------------------------------------------------ OPENCLASSROOMSAPI HELPERS --

const isNullOrUndefined = value => {
    return value === null || value === undefined
}



const isArray = _ => Array.isArray(_);

// ---------------------------------------------------- OPENCLASSROOMSAPI API --



/*****
 *
 * FILE: ypp.input_file()
 * Generated at	
 * 	(fr)		lundi 22 avril 2024
 */

/**
 *
 * DEPENDENCIES:
 * 		xhrinterceptor
 * 		dayjs with plugins : isSameOrBefore,isSameOrAfter and locale
 * 		test.assert
 * NOTESTT: (fr) il s'agit ici de la version la plus basique sans import
 */
// ---------------------------------------------------------------------- HEADER
const OCAPI_h = {
	NAME:   'openclassrooms.api.js'
	,VERSION:'202404.001'
};



// ------------------------------------------------------------------------ CODE
const createAPIFactory = (create, interceptor
  , API_BASE_URL = "https://api.openclassrooms.com"
  , header=OCAPI_h) => {

	// LIFE CYCLE ENUMS
	const LIFE_CYCLE_STATUS_PENDING 		= 'pending';  	// en attente
	const LIFE_CYCLE_STATUS_CANCELED 		= 'canceled';
	const LIFE_CYCLE_STATUS_COMPLETED 		= 'completed';
	const LIFE_CYCLE_STATUS_LATE_CANCELED 	= 'late canceled';
	const LIFE_CYCLE_STATUS_ABSENT 			= 'marked student as absent';

	const bUseCache = true;

	// CACHE MANAGEMENT
	/**
	 * Namespace pour les opérations de cache.
	 * NOTESTT: utilise la page courante pour stocker des données en cache
	 * dans un noeud script de type application/json
	 * @namespace Cache
	 */
	const Cache = {
		/**
		 * Récupère les données du cache.
		 * @memberof Cache
		 * @param {string} [cacheName] - Le nom du cache.
		 * @returns {{ oData: any, cacheTimestamp: number }} Les données du cache.
		 */
		getCacheData: function(cacheName) {
			const actualCacheName = cacheName || "defaultCache";
			const cacheScript = document.getElementById(actualCacheName);
			if (cacheScript && cacheScript.textContent) {
				return JSON.parse(cacheScript.textContent);
			}
			return { data: null, cacheTimestamp: null };
		},

		/**
		 * Définit les données du cache.
		 * @memberof Cache
		 * @param {*} oPrices - Les données à stocker dans le cache.
		 * @param {number} cacheTimestamp - Le timestamp de la mise à jour du cache.
		 * @param {string} [cacheName] - Le nom du cache.
		 * @returns {string} Le nom du cache utilisé.
		 */
		setCacheData: function(data, cacheTimestamp, cacheName) {
			const actualCacheName = cacheName || "cache_" ; // note stt a implementer avec mon cache simple+ uuidv4(); // Générer un UUID simple si aucun nom de cache n'est fourni
			let cacheScript = document.getElementById(actualCacheName);

			if (!cacheScript) {
				// Créer l'élément de script s'il n'existe pas
				cacheScript = document.createElement("script");
				cacheScript.setAttribute("id", actualCacheName);
				cacheScript.setAttribute("type", "application/json");
				document.body.appendChild(cacheScript);
			}

			const cacheData = { data, cacheTimestamp };
			cacheScript.textContent = JSON.stringify(cacheData);

			return actualCacheName;
		}
	};


	// API HELPERS

	// help to build range key param{key: "Range", value: "items=0-19"}
	const _getLimit = (iFrom,iTo) => {return {'Range':`items=${iFrom}-${iTo}`};}
	// build ascii string for sorting
	// NOTESTT:beware of space in string before ordering keyword, and convert
	const _getSort = (sField='sessionDate',sOrder='ASC') => `&sort=${sField}${encodeURIComponent(" "+sOrder)}`;
	// max size of a slice NOTESTT: openclassroom limite la taille d'une tranche de retour API à 20;
	const _getLimitOfSlice = () => 20; // API LIMIT

	let _iNbOfSessionInHistory = 0;
	const _getHistorySize = () => _iNbOfSessionInHistory;
	/* NOTESTT: pas d'interet
	const _getHistorySize = function(){
		const sCacheId = "cache_iNbOfSessionInHistory"
		if(bUseCache){
			const { data, cacheTimestamp } = Cache.getCacheData(sCacheId);
			if (data && cacheTimestamp && (Date.now() - cacheTimestamp) < 86400000) {

				console.log("Cache cache_iNbOfSessionInHistory hit");

				return data;
			}
			return _iNbOfSessionInHistory;
		}
		 else return _iNbOfSessionInHistory;
	}
	*/
	const _setHistorySize = (iSize) => _iNbOfSessionInHistory = iSize;
	/* NOTESTT: pas d'interet
	const _setHistorySize = function(iSize) {
		const sCacheId = "cache_iNbOfSessionInHistory"
		_iNbOfSessionInHistory = iSize;
		if(bUseCache){
			Cache.setCacheData(iSize, Date.now(), sCacheId);
		}
		return _iNbOfSessionInHistory;
	}
	* */
	// comme je n'ai aucun moyen de trouver le nombre minimum de sessions dans la mémoire il faut que je parte d'une valeur par défaut
	const _guessNbOfSessionInHistory = () => 20000;

	/**
	 * Effectue une requête HTTP GET asynchrone à l'URL donnée en utilisant la fonction xGet.
	 *
	 * NOTESTT: (fr) cette fonction est juste un hepler pour faire les test sur des nouvelles url
	 *
	 * @param {string} sURL - L'URL à laquelle envoyer la requête.
	 * @returns {Promise} - Une promesse qui se résout avec la réponse de la requête.
	 */
	const fetchGet = async (sURL) => {
		return await xGet(sURL);
	};

	/**
	 * Effectue une requête HTTP GET asynchrone à l'URL donnée avec les en-têtes spécifiés.
	 * Si l'en-tête 'Range' est présent, la fonction appellera _orchestrateRequests pour
	 * gérer la plage de données demandée.
	 *
	 * @param {string} sURL - L'URL à laquelle envoyer la requête.
	 * @param {Object} [oHeaders] - Les en-têtes à inclure dans la requête. Si l'en-tête 'Range'
	 *                               est présent, la fonction appellera _orchestrateRequests pour
	 *                               gérer la plage de données demandée.
	 * @returns {Promise} - Une promesse qui se résout avec la réponse de la requête.
	 */
	const xGet = async (sURL, oHeaders) => {
		let bVerbose = false;
		if (oHeaders){
			if ( oHeaders['Range']) {
				// NOTESTT (fr) rappel  // {return {'Range':`items=${iFrom}-${iTo}`};}
				if(bVerbose){console.log("%c%s%c whe have some ranges will call _xGetMany, oHeaders are %o", C.APP_DEBUG_STYLE, `${header.NAME}.xGet()`, "", oHeaders); }
				return await _xGetMany(sURL, oHeaders);
				/*
				// -------------------------------------------- *** DEPRECATED !
				if(bVerbose){console.log("%c%s%c whe have some ranges will call _orchestrateRequests, oHeaders are %o", C.APP_DEBUG_STYLE, `${HEADER.NAME}.xGet()`, "", oHeaders); }

				try {
					const _values = oHeaders['Range'].split("=")[1].split("-");
					if(bVerbose){ console.log("%c%s%c splitted values are %o", C.APP_DEBUG_STYLE, `${HEADER.NAME}.xGet()`, "", _values); }
					const iMin = _values[0] * 1; // ou parseInt( _values[0], 10);
					const iMax = _values[1] * 1; // ou parseInt( _values[1], 10);

					return await _orchestrateRequests( sURL, iMin,  iMax, 100 );
				}catch(e){ console.log("Error %o In splitted header range %o", e, oHeaders['Range']); }
				*/
			}
		}

		if(bVerbose){console.log("%c%s%c whe have no ranges call _xGetOne", C.APP_DEBUG_STYLE, `${header.NAME}.xGet()`, ""); }

		return await _xGetOne(sURL, oHeaders);

	};

	/**
	 * Effectue une requête HTTP GET asynchrone à l'URL donnée en utilisant Axios.
	 *
	 * @param {string} sURL - L'URL à laquelle envoyer la requête.
	 * @param {Object} [oHeaders] - Les en-têtes à inclure dans la requête. Si l'en-tête 'Range'
	 *                               est présent, la fonction ajoutera cet en-tête à la requête.
	 * @returns {Promise} - Une promesse qui se résout avec la réponse de la requête.
	 *
	 * NOTESTT: private
	 */
	const _xGetOne = async (sURL, oHeaders) => {
		var axios = create();
		let bVerbose = false;
		if(bVerbose){ console.log("%c%s%c Will call this url:%s with this headers:%o", C.APP_DEBUG_STYLE, `${header.NAME}._xGetOne()`, "", sURL, oHeaders); }

		const response = await axios.get(sURL, {
			headers: {
				'Accept': "application/json;version=0.1",
				'Content-Type': "application/json",
				'X-Requested-With': "XMLHttpRequest",
				'Authorization': interceptor.getBearer('openclassrooms.com')
			},
			transformRequest: [(data, headers) => {
				// NOTESTT: (fr) voir issues/82 pour un exemple sur redaxios
				if (oHeaders){
					if ( oHeaders['Range']) {
						headers['Range'] = oHeaders['Range'];
						if(bVerbose){console.log("openclassroom.api will ads range to header with value:%o", oHeaders['Range']);}
					}
				}

			}],
		}).catch(function (error) {
			//console.error("%c%s%c HTTP/Axios Error", C.APP_ERROR_STYLE, `${header.NAME}._xGetOne()`, "");
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				// NOTESTT: use log because don't need too much log info
				console.groupCollapsed("Error with a response object:")
				console.error("%c%s%c HTTP/Axios Error", C.APP_ERROR_STYLE, `${header.NAME}._xGetOne()`, "");
				console.log("error.response.data...:%o", error.response.data);
				console.log("error.response.status.:%o", error.response.status);
				console.log("error.response.headers:%o", error.response.headers);
				console.groupEnd();
			} else if (error.status) {
				if (error.status === 416){
					// range problem
					console.warn("%c%s%c HTTP/Axios error: %s we have a range problem, not really a probleme, caller have to catch returned error and handle it", C.APP_WARN_STYLE, `${header.NAME}._xGetOne()`, "", error.status );
					// je pourrais faire un throw mais avec une promesse je peux renvoyer plus d'information vraissemblablement ... enfin c'est mistral/chat qui le dit
					return Promise.reject({ code: error.status, message: 'Range error' }); // Rejeter la promesse avec un objet d'erreur contenant le code d'erreur
				}
			} else if (error.request) {
				// The request was made but no response was received
				// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
				// http.ClientRequest in node.js
				console.log("Error give a request:%o", error.request);
			} else {
				// Something happened in setting up the request that triggered an Error
				console.error("%c%s%c HTTP/Axios Error : %o", C.APP_ERROR_STYLE, `${header.NAME}._xGetOne()`, "", error);
				// rethrown ?
				throw error;
			}
		});
		if (typeof response === 'undefined') return null; // NOTSTT reject if error was catched
		return response.data ? response.data : null;
	};

	// NOTESTT:juste pour assurer de la cohérence avec xGetOne
	const _xGetMany = async (sURL, oHeaders) => {
		let bVerbose = false;
		let sHeader = `${header.NAME}._xGetMany()`
		if (oHeaders && oHeaders['Range']) {
			try {
				const _values = oHeaders['Range'].split("=")[1].split("-");
				if(bVerbose){ console.log("%c%s%c splitted values are %o", C.APP_DEBUG_STYLE, sHeader, "", _values); }
				const iMin = _values[0] * 1; // ou parseInt( _values[0], 10);
				const iMax = _values[1] * 1; // ou parseInt( _values[1], 10);

				return await _orchestrateRequests( sURL, iMin,  iMax, 100 ); // use 100 as minimal slices
			}catch(e){
				if (e.code === 416) {
					console.error("%c%s%c: Error %o In splitted header with range %o", C.APP_ERROR_STYLE,sHeader,"",e, oHeaders['Range']);
				} else {
					console.error("%c%s%c: Generic Error %o ", C.APP_ERROR_STYLE,sHeader,"",e) ;
				}
			}
		}
		console.error("%c%s%cWe try to call a version to get Many Slice of request but no header or no range was provided", C.APP_ERROR_STYLE, sHeader, "");
	}

	/**
	 * Orchestre plusieurs requêtes HTTP GET asynchrones pour récupérer une plage de données.
	 * La fonction divise la plage de données en tranches et envoie une requête pour chaque tranche.
	 * Les résultats sont ensuite concaténés et renvoyés.
	 *
	 * @param {string} url - L'URL à laquelle envoyer les requêtes.
	 * @param {number} start - L'index de début de la plage de données à récupérer.
	 * @param {number} end - L'index de fin de la plage de données à récupérer.
	 * @param {number} [debugLimit=Infinity] - Limite de débogage pour éviter une récursion trop profonde.
	 * @returns {Promise} - Une promesse qui se résout avec le tableau de données concaténées.
	 *
	 * NOTESTT: private
	 */
	const _orchestrateRequests = async function (url, start, end, debugLimit = Infinity) {
		//const batchSize = 20; // Taille de chaque tranche
		const batchSize = _getLimitOfSlice(); // Taille de chaque tranche
		const requests = []; // Keep future request to do
		const totalItems = end - start; // Nombre total d'éléments à récupérer
		// safeGuard recursion avoid too deep recursion
		let iterationCounter = 0;
		let bVerbose = false;
		const errors = []; // Tableau pour stocker les erreurs
		// debugging purpose handle all request
		let aDbgRequests = [];
		aDbgRequests.push( [ "startIdx", "endIdx", "oHeaders", "requestPromise"] );

		if(bVerbose){ console.log("%c%s%c start", C.APP_DEBUG_STYLE, `${header.NAME}._orchestrateRequests()`, ""); }
		// Calculer le véritable début et la fin en fonction des contraintes de l'API
		const apiStart 	= Math.floor(start / batchSize) * batchSize;
		const apiEnd 	= Math.ceil(end / batchSize) * batchSize - 1;

		try {
			// Créer les promesses pour chaque tranche de données
			for (let i = apiStart; i <= apiEnd; i += batchSize) {
				if (iterationCounter >= debugLimit) {
					console.error("Debug limit reached. Stopping further iterations.");
					break;
				}
				const startIdx = i;
				const endIdx = i + batchSize - 1; // Limite de la tranche (mise à jour)
				// security check
				if (startIdx > endIdx) {
					console.warn("Invalid start index(%o) and end index (%o) : start>end", startIdx, endIdx);
					continue;
				}
				const oHeaders = _getLimit(startIdx,endIdx);
				if(bVerbose){ console.log("%c%s%c will use %d and %d in headers", C.APP_DEBUG_STYLE, `${header.NAME}._orchestrateRequests()`, "", startIdx, endIdx); }
				// Lancer la requête et stocker la promesse
				if(bVerbose){ console.log("%c%s%c so will use %o as headers", C.APP_DEBUG_STYLE, `${header.NAME}._orchestrateRequests()`, "", oHeaders); }
				const requestPromise = _xGetOne(url, oHeaders)
					/* @__PURE_R__ si je laisse le then ici je dois renvoyer quelque chose sinon la promesse ne renverra rien */
				  .catch(error => {
						// console.error('We are in batch and we caught an error in batched request:', error);
						return Promise.resolve([]); // Propager la résolution de la promesse avec une valeur vide
					});

				if (!requestPromise || typeof requestPromise.then !== 'function') {
					console.warn("Invalid promise returned by _xGetOne():", requestPromise);
					continue;
				}

				if(bVerbose){ console.log("%c%s%c requestPromise is created, stack it", C.APP_DEBUG_STYLE, `${header.NAME}._orchestrateRequests()`, ""); }
				requests.push(requestPromise);
				aDbgRequests.push( [ startIdx, endIdx, oHeaders, requestPromise] );
				if(bVerbose){ console.log("%c%s%c requestPromise is created, stack it in %o", C.APP_DEBUG_STYLE, `${header.NAME}._orchestrateRequests()`, "", requests); }
				iterationCounter++;

			}
		} catch (error) {
			 console.warn('%c%s%c i have catch an error but no idea why : %o', C.APP_WARN_STYLE_STYLE, `${header.NAME}._orchestrateRequests()`, "", error);
		}

		// Attendre que toutes les requêtes soient terminées
		if(bVerbose){ console.log("%c%s%c waiting for all thos promises to be terminated: %o", C.APP_DEBUG_STYLE, `${header.NAME}._orchestrateRequests()`, "", requests); }
		// l'utilisation de Promise.all conduit a un probleme de gestion des try cathc, pour le bien il faudrait utiliser Promise.allSettled
		const responses = await Promise.all(requests);

		/* @__PURE_R__  si je voulais gérer les erreurs récupérées avant par le catch de xGetOne il faudrait les y collecter et le faire ici */


		if(bVerbose){ console.log("%c%s%c end, will filter returned values : %o", C.APP_DEBUG_STYLE, `${header.NAME}._orchestrateRequests()`, "", responses); }

		// compute size of total returned items
		let _iTotalItems = responses.reduce((acc, _responses) => {
			const v = (typeof _responses !== 'undefined')  ? _responses.length : 0; // le faire directement dans le retour ne fonctionne pas bien
			return acc + v;
		}, 0);

		// set new limit - recalculate each time a batch was processed, it have almost no cost and better for security
		if( _iTotalItems < totalItems ){
			if(bVerbose){ console.log("%c%s%c Limit of data seem to be reached %d (sum of responses.length) < %d (totalItems)"
				,  C.APP_DEBUG_STYLE, `${header.NAME}._orchestrateRequests()`, "", _iTotalItems, totalItems); }
			//_setHistorySize( start + _iTotalItems );
			//if(bVerbose){ console.log("%c%s%c  Limit is now set to %d", C.APP_DEBUG_STYLE, `${header.NAME}._orchestrateRequests()`, "", _getHistorySize() ); }
		}

		// Concaténer les éléments de chaque réponse
		// possibilité d'avoir un sousTableau null
		let _responses = responses.flatMap((_aR, index) => {
			if (_aR !== null) {
				return _aR.map((element, idxOfArray) => {
					return { index: index * _aR.length + idxOfArray, valeur: element };
				});
			} else {
				return [];
			}
		}).sort((a, b) => a.index - b.index)
		  .reduce((acc, { valeur }) => {
				acc.push(valeur);
				return acc;
			}, []);

		if(bVerbose){ console.log("%c%s%c consolided array : %o", C.APP_DEBUG_STYLE, `${header.NAME}._orchestrateRequests()`, "", _responses); }

		/*
		 * NOTESTT: (fr)
		 * La méthode flatMap est utilisée pour parcourir chaque sous-tableau du
		 *  tableau bidimensionnel et renvoyer un nouveau tableau contenant un
		 *  objet avec l'index calculé et la valeur de l'élément.
		 * La méthode sort est ensuite utilisée pour trier les éléments en
		 *  fonction de l'index calculé.
		 * Enfin, la méthode reduce est utilisée pour construire le
		 *  tableau final en ajoutant chaque élément à un nouveau tableau.
		 */

		// NOTESTT: (fr) recalcul des indices à utiliser
		// 		quand je demande 0,19 je dois bien utiliser 0,19
		// 		quand je demande 200,250 je dois utiliser 0 et 50
		const _delta = 0 - start;
		if(bVerbose){ console.log("%c%s%c _delta is %d will slice(%d,%d)", C.APP_DEBUG_STYLE, `${header.NAME}._orchestrateRequests()`, "", _delta,start+_delta,end+_delta); }
		return _responses.slice(start+_delta, end+_delta)
	}

	// note stt pas de response interceptor
	// utilisation du try catch avec le await
	/**
	 * xPost
	 */
	const xPost = async (sURL, mData={}, bThrowError = true) => {
		var axios = create();

		try {
			const {data} = await axios.post(sURL, mData, {
				headers: {
					//'Accept': "application/json;version=0.1",
					'Content-Type': 'application/json'
					,'X-Requested-With': "XMLHttpRequest"
					,'Authorization': interceptor.getBearer('openclassrooms.com')
					//,'Content-Type': 'multipart/form-data'
					//,'Content-Type': 'application/x-www-form-urlencoded'
			  }
			})
		}
		catch(error) {
			console.error("%c%s%c HTTP/Axios Error %o", C.APP_ERROR_STYLE, `${header.NAME}.xPost()`, "", error);
			if (error.response) {
				// The request was made and the server responded with a status code
				// that falls out of the range of 2xx
				console.groupCollapsed("Error with response:")
				console.log("error.response.data...:%o", error.response.data);
				console.log("error.response.status.:%o", error.response.status);
				console.log("error.response.headers:%o", error.response.headers);
				console.groupEnd();
			} else if (error.request) {
				// The request was made but no response was received
				// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
				// http.ClientRequest in node.js
				console.error("Error give a request:%o", error.request);
			} else {
				// Something happened in setting up the request that triggered an Error
				console.error('Generic Error:', error.message);
			}
			if (error.data && error.data.errors) {
				//error.data.errors.map( e => console.log(`OC_ERROR: CODE:${e.code} FIELD:${e.field} MSG:${e.message}`))
				const myResult = err(Object.assign({},error.data.errors)); // create an new deep copy
				return myResult;
			}
			// je ne devrais jamais arriver là normalement
			if(bThrowError === true){
				throw new Error(`[Api.xPost()] Irrecoverable error :${error}`);
			}
			// Add the return statement here to properly propagate the error
			console.error(`[Api.xPost()] Irrecoverable error :${error}`);
			//return Promise.reject(error);
		};
		return data;

	};



	// FUNCTIONS PURE API

/*
	Liste des routes implementées et testées
	* GET https://api.openclassrooms.com/users/9786459
	* GET https://api.openclassrooms.com/users/13361938/followed-path
	Liste des routes implementées
	* GET https://api.openclassrooms.com/users/7688561/expected-benefits
	* GET https://api.openclassrooms.com/users/13361938/links
	* GET https://api.openclassrooms.com/users/13361938/paths
	* GET https://api.openclassrooms.com/mentoring-sessions/2250680/
	* GET https://api.openclassrooms.com/presentation-sessions/2250680/
	* GET https://api.openclassrooms.com/users/13361938/mentor-suggestion
	Liste des routes abandonnées
	*
	Liste des routes non implementées

*/

	// DOMAIN BASE (NoteStt: inclassable) //////////////////////////////////////
	/**
	 * get the current user
	 *
	 * @returns {Promise}
	 * NOTESTT a priori c'est pareil que de faire getUser(avec l'id retourné dans me)
	 */
	const getMe = async () => {
		const API_ME_URL = API_BASE_URL + "/me";
		let _r = await fetchGet(API_ME_URL);
		return _r;
	};

	/** raccourci **/
	const _getMyId  = async () => {
			let _r = await getMe();
			return _r.id;
	};

	/**
	 * getUser
	 * @param {integer} id of user
	 *
	 * @sample https://api.openclassrooms.com/users/9786459
	 * NOTESTT: (fr) on ne peut pas/plus aller voir tous les "users"
	 */
	const getUser = async function(iUser=null){

		if (iUser === null) {
			let _r = await getMe();
			iUser = _r.id;
		}

		const API_USER = `${API_BASE_URL}/users/${iUser}`;
		let _r = await xGet(API_USER);
		return _r;
	};

	/**
	 * getUserAvailabilities
	 */
	const getUserAvailabilities = async function(iUser=null){
		if (iUser === null) {
			let _r = await getMe();
			iUser = _r.id;
		}
		const API_USER = `${API_BASE_URL}/users/${iUser}/availabilities`;
		let _r = await xGet(API_USER);
		return _r;
	};

	/**
	 * getUserExpectedBenefits
	 *
	 * example : https://api.openclassrooms.com/users/7688561/expected-benefits
	 */
 	const getUserExpectedBenefits = async function(iUser=null){
		if (iUser === null) {
			let _r = await getMe();
			iUser = _r.id;
		}
		const API_USER = `${API_BASE_URL}/users/${iUser}/expected-benefits`;
		let _r = await xGet(API_USER,);
		return _r;
	};

	/**
	 * getUserEvents
	 *
	 * @param {integer} id of user
	 * @param {integer} from (start of index of returned data)
	 * @param {integer} to (limit of returned data)
	 *
	 * @return list of events for selected user
	 */
 	const getUserEvents = async function(iUser=null,iFrom=0, iTo=19){
		if (iUser === null) {
			let _r = await getMe();
			iUser = _r.id;
		}
		const API_URL = `${API_BASE_URL}/users/${iUser}/events`;
		let _r = await xGet(API_URL,_getLimit(iFrom,iTo));
		return _r;
	};

	/**
	 * getUserFollowedPath
	 *
	 * example: GET https://api.openclassrooms.com/users/13361938/followed-path
	 *
	 * NOTESTT: je presume que ça retourn le diplome actif
	 */
	const getUserFollowedPath = async function(iUser=null){
		if (iUser === null) {
			let _r = await getMe();
			iUser = _r.id;
		}
		const API_URL = `${API_BASE_URL}/users/${iUser}/followed-path`;
		let _r = await xGet(API_URL);
		return _r;
	};

	/**
	 * getUserLinks
	 *
	 *  exemple https://api.openclassrooms.com/users/13361938/links
	 */
 	const getUserLinks = async function(iUser=null){
		if (iUser === null) {
			let _r = await getMe();
			iUser = _r.id;
		}
		const API_USER = `${API_BASE_URL}/users/${iUser}/links`;
		let _r = await xGet(API_USER,);
		return _r;
	};

	/**
	 * getUserPaths
	 *
	 * example GET https://api.openclassrooms.com/users/13361938/paths
	 *
	 * NOTESTT: je presume que ça retourne la liste de tous les diplomes suivi
	 */
	const getUserPaths = async function(iUser=null){
		if (iUser === null) {
			iUser= await _getMyId();
		}
		const API_URL = `${API_BASE_URL}/users/${iUser}/paths`;
		let _r = await xGet(API_URL);
        return _r;
	};

	/**
	 * getUserPathProjects
	 */
	const getUserPathProjects = async function(iUser=null,iPath=null){
		if (iUser === null) {
			iUser= await _getMyId();
		}
		// Checking data
		test.assert(
			typeof iPath === 'number' || typeof iPath === 'string',
			'You must provide an integer or string as path.',
			TypeError
		);
		const API_URL = `${API_BASE_URL}/users/${iUser}/paths/${iPath}/projects`;
		let _r = await xGet(API_URL);
		return _r;
	};

	/**
	 * getUserStudents
	 */
	const getUserStudents = async (iUser = null) => {
		if (iUser === null) {
			let _r = await getMe();
			iUser = _r.id;
		}
		const API_REQUEST = `${API_BASE_URL}/mentors/${iUser}/students`;
		let _r;
		try {
			_r = await xGet(API_REQUEST);
		} catch (e) {
			console.error("%c[getUserStudents()] Trapped error %o", C.APP_ERROR_STYLE, e);
		} finally {
			return _r;
		}
	};

	// DOMAIN MENTOR ///////////////////////////////////////////////////////////
	/**
	 * return a long object with properties from mentor
	 * @param {number} iUser - le code utilisateur.
	 * @returns {Promise}
	 * NOTESTT:notamment les locales ce dont je me servirais bien pour la partie calendrier
	 */

	const getMentor = async (iUser = null) => {
		// if iUser is null get info about me
		if (iUser === null) {
			let _r = await getMe();
			iUser = _r.id;
		}

		const API_REQUEST = `${API_BASE_URL}/mentors/${iUser}`;
		let _r;

		try {
			_r = await xGet(API_REQUEST);
		} catch (e) {
			console.error("%c[getMentor()] Trapped error %o", C.APP_ERROR_STYLE, e);
		} finally {
			return _r;
		}
	}


	// DOMAIN SESSION //////////////////////////////////////////////////////////
	/**
	 * getHistorySession
	 *
	 * @param {array}
	 * @param {integer}
	 * @param {integer}
	 *
	 */
	const getHistorySessions = async (aLifeCycle=[], iFrom=0, iTo=19) =>
		await _getSessions({aLifeCycle, iFrom, iTo});

	/**
	 * getHistorySessionsBefore
	 */
	const getHistorySessionsBefore = async() => {

	}

	/**
	 * getHistorySessionsAfter
	 */
	const getHistorySessionsAfter = async() => {

	}

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ LOCAL HELPERS ~~
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ LOCAL HELPERS ~~
	/*--[[ NOTESTT: (fr) il s'agit d'un paquets de 3 fonctions qui permettent de
	 * sonder un tableau pour trouver une valeur début et fin de manière
	 *optimisée (deux recherches), ce qui a ete abandonné l'algo d'optimisation
	 *  partait du centre du tableau pour essayer de gagner du temps mais ici
	 * c'est forcément faux s'il tombe mal vu qu'on compare des jours
	 *
	 *
	 *  --]]*/
	/**
	 * _findInArray
	 */
	const _findInArray = function(aData, dtFrom, dtTo) {



		let startIndex = _findStartIndex(aData, dtFrom);
		if (startIndex === -1) {
			return null;
		}

		let endIndex = _findEndIndex(aData, dtTo, startIndex);
		if (endIndex === -1) {
			return null;
		}


		return aData.slice(startIndex, endIndex + 1);
	}
	/**
	 * _findStartIndex
	 */

	const _findStartIndex = function(aData, dtFrom) {
		let left = 0;
		let right = aData.length - 1;


		while (left <= right) {
			let dtDate = dayjs(aData[left].sessionDate);
			if (dtDate.isSameOrAfter(dtFrom, 'day')) {
				return left;
			}
			left++;
		}

		return left;
	}

	/**
	 * _findEndIndex
	 */

	const _findEndIndex = function (aData, dtTo, startIndex) {
		let left = startIndex;
		let right = aData.length - 1;


		while (left <= right) { // tant qu'on a pas epuisé le tableau
			let dtDate = dayjs(aData[right].sessionDate);
			if (dtDate.isSameOrBefore(dtTo, 'day')) {
				return right;
			}
			right--;
		}

		return right;
	}


	/**
	 *
	 * _calculateNextFrom
	 *
	 * iLeft: Ecart entre le début du lot et la date demandée début
	 * iDelta: Ecart entre la date de début du lot et la date de fin de lot = durée en jour du lot
	 * iSlice: La taille d'une tranche
	 * iFrom: l'indice dans le tableau résultat des données de l'api (la totalité des résultats en base calculé à partir de 0 le plus ancien résultat retourné par l'historique)
	 */

	const _calculateNextFrom = (iLeft, iDelta, iSlice, iFrom) => {

		console.log("%c%s:getHistorySessionsBetween()%c enter _calculateNextFrom()",C.APP_DEBUG_STYLE,header.NAME,"")

		if (iLeft < 0) {
			if (Math.abs(iLeft) < iDelta) {
				// je retourne la valeur initiale du tableau ce qui fait qu'on arrête de tourner
				return iFrom;
			} else {
				return Math.round((Math.abs(iLeft) / iDelta)) * iSlice + iFrom;
			}
		} else if (iLeft > 0) {
			let iDays = Math.round(iLeft / iDelta); // nombre de jours de sessions à raison de la moyenne journalière de sessions
			if(iDays < 1){ iDays = 1; }
			let iNextFrom = iFrom - (iDays * iSlice);
			if (iNextFrom < 0) {
				throw new Error(`ERROR iNextFrom=${iNextFrom} which was < 0`);
			}
			return iNextFrom;
		}
	};

	/**
	 * _calculateNextTo
	 */

	const _calculateNextTo = (iRight, iDelta, iSlice, iTo) => {

		console.log("%c%s:getHistorySessionsBetween()%c enter calculateNextTo()",C.APP_DEBUG_STYLE,header.NAME,"");
		// si j'ai un nombre négatif c'est que je n'ai pas assez reculé
		if (iRight < 0) {
			return Math.round((Math.abs(iRight) / iDelta)) * iSlice + iTo;
		}

	  return iTo;
	};

	/**
	 * _sonar
	 */

	const _sonar = function(aSessions, sFrom, sTo) {

		// on a besoin de s'assurer que les données soient bien triées sur la date de session
		aSessions.sort((a, b) => dayjs(a.sessionDate).unix() - dayjs(b.sessionDate).unix());

		// NOTESTT: par précaution on encadre un jour plus tot et un jour plus tard pour éviter de passer a côté d'un jour dans un lot précédent ou suivant

		const dtFrom = dayjs(sFrom);
		const dtFromOneDayBefore = dtFrom.subtract(1, 'days');
		const dtTo = dayjs(sTo);
		const dtToOneDayAfter = dtTo.add(1, 'days');
		const dtResFrom = dayjs(aSessions[0].sessionDate);
		const dtResTo = dayjs(aSessions[aSessions.length - 1].sessionDate);


		// nombre de jour nécessaire pour compenser la partie gauche de la borne >0 =

		//const iLeft = dtResFrom.diff(dtFrom, 'day');
		const iLeft = dtResFrom.diff(dtFromOneDayBefore, 'day');
		//const iRight = dtResTo.diff(dtTo, 'day');
		const iDelta = dtResTo.diff(dtResFrom, 'day'); // écart en jour dans le lot
		const iRight = dtResTo.diff(dtToOneDayAfter, 'day');
		return [iLeft, iRight, iDelta];

	}


// HELPERS
// verifie que les données soient bien incluses dans le tableau
// renvoie
//  [O] TRUE si la date de début de l'échantillon est identique ou antérieure à la date de début de période recherchée
//  [1] TRUE si la date de début de l'échantillon est identique ou postérieure à la date de début de période recherchée
	const _checkRange = function(aData,sFrom, sTo){

		test.assert(
			Array.isArray(aData),
			'data must be an array',
			TypeError
		);

		const dtFrom = dayjs(sFrom);
		const dtFromOneDayBefore = dtFrom.subtract(1, 'days');
		const dtTo = dayjs(sTo);
		const dtToOneDayAfter = dtTo.add(1, 'days');

		if(
			aData.length > 1
			&& aData[0].hasOwnProperty('sessionDate')
			&& aData[aData.length-1].hasOwnProperty('sessionDate')
		){
			const dtDataFirst = dayjs(aData[0].sessionDate);
			const dtDataLast = dayjs(aData[aData.length-1].sessionDate);

			const _b1 = dtDataFirst.isSameOrBefore(dtFromOneDayBefore);
			const _b2 = dtDataLast.isSameOrAfter(dtToOneDayAfter);

			console.log("%c%s%c Dates: Echantillon:%s-%s Recherchées %s-%s, isSameOrBefore:%o-isSameOrAfter:%o","","checkRange()",""
			  ,dtDataFirst.format("DD/MM/YYYY"),dtDataLast.format("DD/MM/YYYY")
			  ,dtFrom.format("DD/MM/YYYY"),dtTo.format("DD/MM/YYYY")
			  , _b1, _b2
			);

			return [_b1,_b2];
		}
		return[false, false];

	}

	const _guessNextIFrom = function(aData, sFrom, sTo, iFrom, iLimitTo=666, iSlice=100, iFromLastSuccessfullTry=0){

		const bVerbose = false;
		if (bVerbose){ console.log("_guessNextIFrom() cette fonction tente de deviner le meilleur iFrom, commençons par le calculer");}

		const [iLeft, iRight, iDelta] = _sonar(aData, sFrom, sTo);
		if (bVerbose){ console.log("_sonar() return this values iLeft: %d iDelta: %d iSlice %d iFrom %d", iLeft, iDelta, iSlice, iFrom); }

		iNextFrom = _calculateNextFrom(iLeft, iDelta, iSlice, iFrom);
		if (bVerbose){ console.log("First estimation said : from Previously From:%d go to NextFrom:%d",iFrom,iNextFrom); }

		// prevoir un garde fou pour nextFrom
		//if (iNextFrom+iSlice > iLimitTo) {
		// le probleme c'est que si j'inclus la tranche alors je ne sortirais jamais les lots de la derniere tranche
		// mais je ne peux pas non plus m'arreter si je suis sur la derniere tranche je dois pouvoir boucler en arriere
		if (iNextFrom > iLimitTo) {
			iNextFrom = iLimitTo - iSlice;
			const iGuess =  Math.round(((iNextFrom - iFromLastSuccessfullTry) / 3) / 10) * 10;
			if (iGuess < iSlice){
				//console.warn("On a un probleme l'écart estimé %d est trop petit (inférieur à une tranche), on va utiliser %d (une tranche) à soustraire à %d(iNextFrom)" ,iGuess, iSlice, iNextFrom);
				iNextFrom = iNextFrom - iSlice;
			} else {
				//console.warn("Je pense que %d est un bon compromis à soustraire à %d (iNextFrom)" ,iGuess, iNextFrom);
				iNextFrom = iNextFrom - iGuess;
			}
			if(bVerbose){ console.warn("Second estimation said set pouriNextFrom from :%d  to %d",iFrom,iNextFrom); }

		} else {
			if(bVerbose){ console.log("iNextFrom: %d + iSlice:%d <= iLimitTo: %d continue...",iNextFrom, iSlice, iLimitTo); }
		}

		return iNextFrom;

	}

	/**
	 * getHistorySessionsBetween : get Sessions from history between two dates
	 *
	 * @param {}
	 * @param {}
	 * @param {}
	 * 		params options !
	 *
	 * NOTESTT: (fr)
	 * 		Précédement cette fonction était appellée directement
	 * 		 désormais elle est enrobée pas une fonction de cache d'ou le _
	 * 		mon enregistrement qui correspond au 01/01/2024 est le 12013
	 */

	 /*
	  * Notes:
	  *
	  * Mon principal probleme est que je ne sais absolument rien
	  *
	  * Sauf
	  * 	1. Les sauts se font uniquement pas pas de 20 (le retour api)
	  * 	2. Les saut commenent toujour par une tranche de dizaine paire (0,20,40....)
	  *
	  */

	const _getHistorySessionsBetween= async function(sFrom = '2024-01-01', sTo = '2024-01-31', oOpts = {}) {

		test.assert(
			typeof sFrom === 'string',
			'date from must be a string',
			TypeError
		);

		test.assert(
			typeof sTo === 'string',
			'date to must be a string',
			TypeError
		);

		let bDebug = true;
		let bVerbose = bDebug || false;
		const iGuard = 10; // prevent too much recurse
		let iRun = 0;
		var _r;
		const sHeader = `${header.NAME}getHistorySessionsBetween()`;

		// default params
		let {iFrom, iTo, aLifeCycle, bSort} = Object.assign({
			 iFrom: 0
			,iTo: 100
			,aLifeCycle: [
				 LIFE_CYCLE_STATUS_CANCELED
				,LIFE_CYCLE_STATUS_COMPLETED
				,LIFE_CYCLE_STATUS_LATE_CANCELED
				,LIFE_CYCLE_STATUS_ABSENT
			]
			,bSort:true // bSort => je veux ou pas trier sur la date, je ne vois pas pourquoi je ne le ferais pas cela dit
		}, oOpts);

		// capture la valeur maximale du dernier iFrom réussi
		let iFromLastSuccessfullTry = 0;

		try {

			//let iFrom = 0;
			// let iTo = 100; // si les tranches sont trop petite les calculs de tranche suivante vont etre trop gros supérieurs à la taille du nombre de résultat et on va crasher
			let bContinue = true;
			let iSlice = iTo - iFrom;

			// NOTESTT il faudrait pouvoir controler sur la page du mentor le nombre de sessions disponible pour vérifier que les tranches ne sont pas trop petites

			while (bContinue === true) {

				//next values
				let iNextFrom, iNextTo = 0
				//recursion guard
				if (iRun >= iGuard) {
					throw Error("Recursion Guard hit !!!!!! ")
				}

				if (bVerbose){ console.log("%c%s%c * - * - * Run %d range(%d,%d) * - * - *", C.APP_DEBUG_STYLE,`${header.NAME}.getHistorySessionsBetween()`,"", iRun, iFrom, iTo); }

				//NOTESTT: TODO give ability choose type
				var _r = await APIOC.getHistorySessions([], iFrom, iTo);

				//NOTESTT: j'ai besoin de connaitre la limite en terme de données,
				let iLimitTo;
				if ( _getHistorySize() == 0 ){
					iLimitTo = _guessNbOfSessionInHistory();
				} else {
					iLimitTo = _getHistorySize(); // history size est calculé dans orchestrate request
				}

				//
				if(_r && _r.length >0) {
					// j'ai des résultats
					// on commence par les trier sur la date
					_r = _r.sort((a, b) => dayjs(a.sessionDate).unix() - dayjs(b.sessionDate).unix());
					const _bStop = _checkRange( _r, sFrom, sTo);

					if (_bStop[0] === true && _bStop[1] == true){
						console.log("La période recherchée est dans la tranche retournée -> STOP");
						break;
					}

					if( _r.length < iSlice ){
						//1 - j'ai atteint la limite du tableau = j'ai reçu des données mais moins qu'une tranche complète
						_setHistorySize( iFrom+_r.length );

						iNextFrom =  _guessNextIFrom( _r, sFrom, sTo, iFrom, iLimitTo, iSlice, iFromLastSuccessfullTry);
						iNextTo = iNextFrom + iSlice;
					}

					// 2 - j'ai des résultat mais n'ai pas atteint la limite du tableau
					if( _r.length >= iSlice) {
						console.log("La BDD a retourné des enregistrement et j'en ai assez pour remplir une tranche, je ne pense pas être en bout de table");
						// Mise à jour de la dernière tentative réussie avec une section/tranche complete
						if (iFromLastSuccessfullTry < iFrom){
							iFromLastSuccessfullTry = iFrom;
							console.log("%c>>>>>>>>>>>>>%c Mise a jour de iFromLastSuccessfullTry avec %d", "background-color:black;color:white","",iFromLastSuccessfullTry);
						}

						iNextFrom =  _guessNextIFrom( _r, sFrom, sTo, iFrom, iLimitTo, iSlice, iFromLastSuccessfullTry);
						iNextTo = iNextFrom + iSlice;

						// sortie si les bornes ne changent plus
						if (iFrom == iNextFrom) {
							const [iLeft, iRight, iDelta] = _sonar(_r, sFrom, sTo);
							iNextTo = _calculateNextTo(iRight, iDelta, iSlice, iTo);
							if(iNextTo > iLimitTo){ iNextTo = iLimitTo; }

							if (iTo == iNextTo) {
								// end
								break;
							}

						}

					}

				}

				//

				// 3 - je n'ai pas de valeurs, je suis donc allé trop loin il faut faire machine arriere
				if (_r === null || _r.length == 0) {
					// si l'api ne me renvoie rien c'est que j'ai atteint la limite comme pour le moment on a aucun moyen de trouver cette limite je tente cette démarche
					_setHistorySize( iFrom-iSlice );
					//je l'arrondit par défaut à la dizaine la plus proche
					const iGuess = Math.round( ( ( ( iFrom-iSlice ) - iFromLastSuccessfullTry) / 2) / 10) * 10;
					iNextFrom = iFromLastSuccessfullTry + iGuess
					iNextTo = iNextFrom + iSlice;

				}

				iFrom = iNextFrom;
				iTo = iNextTo;
				iRun++
			} //end of while

		} catch (error) {
			console.error("%c%s%c Error code is %s", C.APP_ERROR_STYLE, sHeader, "", error);
		}

		const dtFrom = dayjs(sFrom);
		const dtTo = dayjs(sTo);
		let resultat = _findInArray(_r, dtFrom, dtTo);
		if (Array.isArray(resultat) && resultat.length>0){
			if (bVerbose){ console.log("VERIFIONS\n rappel on veut les sessions du %s au %s\npremier: %s - dernier %s", sFrom, sTo, resultat[0].sessionDate, resultat[resultat.length - 1].sessionDate); }
		}

		return resultat; // peut être vide;

	}


	// wrap old getHistorySessionsBetween in Cache object
	// NOTESTT: attention l'objet oOpts n'est pas l'objet réel final utilisé par la fonction _getHistorySessionsBetween
	const getHistorySessionsBetween = async function (sFrom, sTo, oOpts={}) {
		const sOpts = JSON.stringify(oOpts);
		const sCacheId=`cache_HistorySessionsBetween_${dayjs(sFrom).valueOf()}-${dayjs(sTo).valueOf()}_${sOpts}`
		const cacheData = Cache.getCacheData(sCacheId);

		if (cacheData.data !== null) {
			return Promise.resolve(cacheData.data); // Renvoie une promesse résolue avec les données du cache
		}

		const data = await _getHistorySessionsBetween(sFrom, sTo, oOpts);
		Cache.setCacheData(data, Date.now(), sCacheId);

		return data;
};

	/**
	 * getPendingSessionAfter
	 * @param {date}
	 * @param {integer}
	 * @param {integer}
	 * 	example : APIOC.getPendingSessionAfter('20230531').then( (e) => console.log('e:',e))
	 *
	 * TODO: use {} for params
	 *
	 * NOTESTT: (fr) pending => planifié donc la liste des sessions planifiée après le xxx
	 */
	const getPendingSessionsAfter = async (dtDate=dayjs(), iFrom=0, iTo=19, iUser = null) => {
		let _r;
		let sFilterDate;
		// check type
		if(typeof dtDate === 'string'){
			dtDate = dayjs(dtDate);
		}
		test.assert(
			dtDate instanceof dayjs === true,
			'date must be a string or a dayjs object.',
			TypeError
		);
		const sDate = encodeURIComponent(dtDate.format('YYYY-MM-DDTHH:MM:ss[Z]'));
		sFilterDate= `&after=${sDate}`;
		_r = await _getSessions ({sFilterDate, dtDate, aLifeCycle:[LIFE_CYCLE_STATUS_PENDING], iFrom, iTo, iUser});
		return _r;
	}

	/**
	 * getPendingSessionBefore
	 * @param {date}
	 * @param {integer}
	 * @param {integer}
	 */
	const getPendingSessionsBefore = async (dtDate=dayjs(), iFrom=0, iTo=19, iUser = null) => {
		let _r;
		let sFilterDate;
		// check type
		if(typeof dtDate === 'string'){
			dtDate = dayjs(dtDate);
		}
		test.assert(
			dtDate instanceof dayjs === true,
			'date must be a string or a dayjs object.',
			TypeError
		);
		const sDate = encodeURIComponent(dtDate.format('YYYY-MM-DDTHH:MM:ss[Z]'));
		sFilterDate= `&before=${sDate}`;
		_r = await _getSessions ({sFilterDate, dtDate, aLifeCycle:[LIFE_CYCLE_STATUS_PENDING], iFrom, iTo, iUser});
		return _r;
	}

	/**
	 * _getSessions : return a list of session for corresponding parameters found in api domain history of sessions
	 * 	@param {object}
	 * 		param object = {iFrom, iTo, aLifeCycle, iUser, sFilterDate, sSort}
	 * 		object.sSort = is the correspoding equivalent to sort methode in string for API
	 */

	const _getSessions = async function(args){
		const HEADER = `${header.NAME}::_getSessions()`
		let bDebug = false;

		// Get the argument values
		let {iFrom, iTo, aLifeCycle, iUser, sFilterDate, sSort} = Object.assign({
			 iFrom: 0
			,iTo: 19
			,aLifeCycle: [
				 LIFE_CYCLE_STATUS_CANCELED
				,LIFE_CYCLE_STATUS_COMPLETED
				,LIFE_CYCLE_STATUS_LATE_CANCELED
				,LIFE_CYCLE_STATUS_ABSENT
			]
			,iUser:null
			,sFilterDate:''
			,sSort:_getSort()
		}, args);

		// Checking data
		test.assert(
			isArray(aLifeCycle) === true,
			'You must provide an array as param aFilter.',
			TypeError
		);
		// filter must not be empty
		if(aLifeCycle.length == 0){
			aLifeCycle=[
				LIFE_CYCLE_STATUS_CANCELED,
				LIFE_CYCLE_STATUS_COMPLETED,
				LIFE_CYCLE_STATUS_LATE_CANCELED,
				LIFE_CYCLE_STATUS_ABSENT,
			]
		}
		// because i need the user (mentor/coach) in this request
		if (iUser === null) {
			let _r = await getMe();
			iUser = _r.id;
		}
		// build a string for lifecycle filter
		let sLifeCycleFilter = aLifeCycle.join(',');
		sLifeCycleFilter = encodeURIComponent(sLifeCycleFilter);

		// execute request
		const API_URL = `${API_BASE_URL}/users/${iUser}/sessions?actor=expert${sFilterDate}&life-cycle-status=${sLifeCycleFilter}${sSort}`;
		let oLimit =  _getLimit(iFrom,iTo);

		if (bDebug){ console.log("%c%s%c Url to call is:%o , xGet additionals params are %o", C.APP_DEBUG_STYLE, HEADER, '',API_URL, oLimit);}
		let _r = await xGet(API_URL, oLimit);
		if(_r === null || _r === undefined ){
			console.error("%c%s%c we have a problem returned value: %o, is null|undefined", C.APP_ERROR_STYLE, HEADER, '', _r);
			throw new Error(`BAD REQUEST: ${API_URL} have a problem`);
		}
		if(_r.errors){
			console.error("%c%s%c return an error %s", C.APP_ERROR_STYLE, HEADER, '',_r.errors.message);
		}
		return _r;
	}

	/**
	 * example: GET https://api.openclassrooms.com/presentation-sessions/2250680/project-session
	 *
	 * return information linked to validation of project
	 */
	 const getProjectOfSessionP = async (iSession) => {
		// Checking data
		test.assert(
			typeof iSession === 'number',
			'You must provide an integer or string as sessionId.',
			TypeError
		);
		const API_USER = `${API_BASE_URL}/presentation-sessions/${iSession}/project-session`;
		let _r = await xGet(API_USER);
		return _r;
	 }

	/**
	 * getSessionM
	 *
	 * return the mentoring sessions linked to a session
	 * example	: GET https://api.openclassrooms.com/presentation-sessions/2250680/
	 * usage	: await APIOC.getSessionM(2667901)
	 */
	const getSessionM = async (iSession) => {
		// Checking data
		test.assert(
			typeof iSession === 'number',
			'You must provide an integer as sessionId.',
			TypeError
		);
		const API_USER = `${API_BASE_URL}/mentoring-sessions/${iSession}/`;
		let _r = await xGet(API_USER);
		return _r;
	}

	/**
	 *
	 * getSessionP
	 *
	 * return the presentation sessions linked to a session
	 * example	: GET https://api.openclassrooms.com/presentation-sessions/2250680/
	 * usage	: await APIOC.getSessionP(2667901)
	 */
	const getSessionP = async (iSession) => {
		// Checking data
		test.assert(
			typeof iSession === 'number',
			'You must provide an integer as sessionId.',
			TypeError
		);
		const API_USER = `${API_BASE_URL}/presentation-sessions/${iSession}/`;
		let _r = await xGet(API_USER);
		return _r;
	}

	// DOMAIN STUDENT //////////////////////////////////////////////////////////
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ LOCAL HELPERS ~~
	/**
	 * 	_downloadContent this function transform an object
	 *    here a text/html to a file
	 *
	 *  Cette fonction permet de télécharger le contenu d'un objet
	 */

	const _downloadContent = (content, fileName) => {
		// Créez un Blob à partir du contenu
		const blob = new Blob([content], { type: 'text/html' });

		// Créer un élément 'a' temporaire
		const downloadLink = document.createElement('a');
		downloadLink.href = window.URL.createObjectURL(blob);
		downloadLink.download = fileName;

		// Simuler un click sur le lien de téléchargement
		downloadLink.style.display = 'none';
		document.body.appendChild(downloadLink);
		downloadLink.click();

		// supprimer le lien
		document.body.removeChild(downloadLink);
	};

	/**
	 *
	 * 	GetStudent informations
	 *
	 * NOTESTT: pas d'exemple car pas d'api a priori, cependant je vais avoir
	 * besoin de collecter des informations sur les étudiants
	 * on va donc tenter d'analyser la fiche étudiante
	 *
	 * NOTESTT(fr): 2024-04-15 à utiliser avec beaucoup de précautions,
	 *   OC ne remet pas forcément à jour les informations
	 *   J'ai le cas d'un étudiant qui n'est plus financé depuis un an
	 *   mais son statut est toujours financé et non pas auto financé sur
	 *   sa fiche
	 */

	const getStudent = async function (id) {
		const url = `https://openclassrooms.com/fr/mentorship/dashboard/students/${id}`;
		let bVerbose = false;
		let bIneedToSaveLocally = false; // NOTESTT: allow to save xhr fetched page for further analysis
		if(bVerbose){ console.log("%c%s%c id is : %s, final url is : %s", C.APP_DEBUG_STYLE, `${header.NAME}.getStudent()`, "", id, url); }

		const fetchAndExtractElements = async (url) => {
			try {
				// NOTESTT: (fr) ici je suis obligé de créer un objet header si
				// je crée un POJO comme header, il n'aura pas les méthode d'un objet header
				// et visiblement d'après les tests j'en aurais besoin de ces méthodes
				const headers = new Headers(); // Créez un objet Headers
				headers.append('Authorization', `Bearer ${interceptor.getBearer('openclassrooms.com')}`); // Ajoutez l'en-tête Authorization

				const response = await fetch(url, {
				  headers: headers,
				});

				const html = await response.text();
				// sauvegarde le en local
				if(bIneedToSaveLocally){ _downloadContent(html, `page_student_id-${id}.html`); }

				const parser = new DOMParser();
				const doc = parser.parseFromString(html, "text/html");

				let _data = {};

				// store courses and user
				_data.courses = []
				_data.user = {}

				const courses = doc.querySelector('#list-course-followed').rows;
				const c = Array.from(courses).slice(1);

				// i prefer not use regexp but replace don't work very well
				for(i=0;i<c.length;i++){
					// remove \n at end of lines
					_data.courses.push({
						 'courses': c[i].cells[0].innerText.replace(/\n/g, "")
						,'start' : c[i].cells[1].innerText.replace(/\n/g, "")
						,'progress' : c[i].cells[2].innerText.replace(/\n/g, "")
						,'certificat': !c[i].cells[3].classList.contains('certificate--notCompleted')
					});
				}

				const scriptElement = doc.querySelector('#studentDetailsConfiguration');
				if (scriptElement) {
					const jsonContent = scriptElement.textContent;
					const studentDetailsConfiguration = JSON.parse(jsonContent);
					const configStudent = studentDetailsConfiguration.configStudent
					const studentId = configStudent.studentId;
					const studentSlug = configStudent.studentSlug;
					const mentorId = configStudent.mentorId;
					const canAssignMentor = configStudent.canAssignMentor;
					const hasFollowedCourses = configStudent.hasFollowedCourses;
					const isFinancialAidStudent = configStudent.isFinancialAidStudent;
					const isStudentNotPremiumPlus = configStudent.isStudentNotPremiumPlus;
					const studentEndStudies = configStudent.studentEndStudies;
					const studentHasEndOfStudies = configStudent.studentHasEndOfStudies;

					_data.user = {
						studentId: studentId,
						studentSlug: studentSlug,
						mentorId: mentorId,
						canAssignMentor: canAssignMentor,
						hasFollowedCourses: hasFollowedCourses,
						isFinancialAidStudent: isFinancialAidStudent,
						isStudentNotPremiumPlus: isStudentNotPremiumPlus,
						studentEndStudies: studentEndStudies,
						studentHasEndOfStudies: studentHasEndOfStudies,
						url: url,
					};

				} else {
					//console.error('Élément script introuvable je ne peux pas aller chercher des informations sur cet étudiant');
					console.error("Could not acces script element, i could 't check information on the student with id %o",id );
				}

				// Return the extracted elements as an object
				return _data;
			} catch (error) {
				console.error(`Error in ${header.NAME}.getStudent() error is: ${error}`);
			}
		};

		return fetchAndExtractElements(url);
	};

	// DOMAIN BOOKING //////////////////////////////////////////////////////////
/**
	 *
	 * Book a session
	 *
	 * @param (int) user
	 * @param (int) project id
	 * @param (int) student id
	 * @param (string) date of the element to book UTC standard format
	 *
	 * @return (object) the result of api call
	 *
	 * URL : https://api.openclassrooms.com/mentoring-sessions
	 *
	 * TEST : bookStudent(809,12111267,"2023-07-14T09:15:00+0000")
	 */
	const bookStudent = async (iProjectId, iStudentId, sDate) => {
		let bVerbose = false;
		// we need to use mentor id
		const iUser= await _getMyId();
		// Checking data
		test.assert(
			typeof iProjectId === 'number' ,
			'You must provide an integer as iProjectId.',
			TypeError
		);

		test.assert(
			typeof iStudentId === 'number' ,
			'You must provide an integer as iStudentId.',
			TypeError
		);

		test.assert(
			typeof sDate === 'string' ,
			'You must provide a string as sDate.',
			TypeError
		);

		const API_URL = `${API_BASE_URL}/mentoring-sessions`;
		// be carefull about date format need
		//const sDate = dtDate.format('YYYY-MM-DDTHH:MM:ss[Z]');
		// example
		// 			{"mentorId":7688561,"projectId":809,"studentId":12111267,"sessionDate":"2023-07-14T09:15:00+0000"}
		const mData = {"mentorId":iUser, "projectId":iProjectId, "studentId":iStudentId, "sessionDate": sDate}

		let _r = await xPost(API_URL, mData, false);

		if ( _r.isErr() ){
			console.error("Erreur API %o", _r);
			// because we could receive more than one
			 for (i in _r.error){
				console.error(`OC_ERROR: CODE:${_r.error[i].code} FIELD:${_r.error[i].field} MSG:${_r.error[i].message}`);
			}
			return -1;
		}

		if (bVerbose){ console.log("%s.bookStudent --> \n%o", header.NAME, _r); }

		return _r;
	}

	// DOMAIN PROJECT //////////////////////////////////////////////////////////
    /**
     *
     * getProject
     *
     * NOTESTT: (fr) on va retoruver deux versions celle avec ou sans utilisateur je ne sais pas si ça change quelque chose
     */
     // https://api.openclassrooms.com/users/12834690/projects/1331
     // await APIOC.fetchGet('https://api.openclassrooms.com/projects/1331') fonctionne aussi

	const getProject= async (iProject, iUser=null) => {

		// Checking data
		test.assert(
			typeof iProject === 'number',
			'You must provide an integer as projectId.',
			TypeError
		);

		let API_USER;

		if( iUser === null){
			API_USER = `${API_BASE_URL}/projects/${iProject}`;
		} else {
			test.assert(
				typeof iUser === 'number',
				'You must provide an integer as userId.',
				TypeError
			);
			API_USER = `${API_BASE_URL}/users/${iUser}/projects/${iProject}`;
		}

		let _r = await xGet(API_USER);
		return _r;

	}

	/**
	 *
	 * getProjectRessources
	 * @param {integer} id of a project
	 * Return list of ressources used by a project
	 *
	 */
	const getProjectRessources  = async (iProject) => {

		// Checking data
		test.assert(
			typeof iProject === 'number',
			'You must provide an integer as projectId.',
			TypeError
		);
		const API_USER = `${API_BASE_URL}/projects/${iProject}/external-resources`;
		let _r = await xGet(API_USER);
		return _r;

	}

	/**
	 *
	 * getProjectCourses
	 * @param {integer} id of a project
	 * Return list of courses used by a project
	 *
	 */
	const getProjectCourses = async (iProject) => {

		// Checking data
		test.assert(
			typeof iProject === 'number',
			'You must provide an integer as projectId.',
			TypeError
		);
		const API_USER = `${API_BASE_URL}/projects/${iProject}/courses`;
		let _r = await xGet(API_USER);
		return _r;

	}

	/**
	 * getProjectCourses
	 * @param {integer} id of a project
	 * @param {integer} id of user (could be undefined/null)
	 * Return list of sections used by a project
	 * NOTESTT: (fr) deux possibilités avec inclusion de l'utilisateur ou pas
	 */
	const getProjectCourseSections = async (iProject, iUser=null) => {

		// Checking data
		test.assert(
			typeof iProject === 'number',
			'You must provide an integer as projectId.',
			TypeError
		);

		let API_USER;

		if (iUser === null){
			API_USER = `${API_BASE_URL}/projects/${iProject}/sections`;
		} else {
			test.assert(
				typeof iUser === 'number',
				'You must provide an integer as userId.',
				TypeError
			);
			API_USER = `${API_BASE_URL}/users/${iUser}/projects/${iProject}/sections`;
		}

		let _r = await xGet(API_USER);
		return _r;

	}

	// DOMAIN MISC /////////////////////////////////////////////////////////////
	/**
	 * suggestMentor
	 * @param {integer} id of user
	 * exemple : GET https://api.openclassrooms.com/users/13361938/mentor-suggestion
	 */
 	const suggestMentor = async function(iUser=null){
		if (iUser === null) {
			let _r = await getMe();
			iUser = _r.id;
		}
		const API_USER = `${API_BASE_URL}/users/${iUser}/mentor-suggestion`;
		let _r = await xGet(API_USER);
		return _r;
	};

	// DOMAIN UTILITY////////////////////////////////////////////////////////////
	/**
	 * convertDurationToSeconds
	 * @param {string}
	 *
	 * convert OC VIDEO TIME
	 */

	const convertDurationToSeconds = function(duration) {

		if (duration == null || duration == 0) return 0;
		const minutesMatch = duration.match(/PT(\d+)M/);
		const secondsMatch = duration.match(/(\d+)S/);

		let minutes = 0;
		let seconds = 0;

		if (minutesMatch) {
			minutes = parseInt(minutesMatch[1], 10);
		}

		if (secondsMatch) {
			seconds = parseInt(secondsMatch[1], 10);
		}

		return minutes * 60 + seconds;
	}


	// ***************************************************** EXPORTED METHODS **
	return {
		// DOMAIN BASE (NoteStt: inclassable)
		 getMe // return current connected user
		// DOMAIN USER
		,getUser
		,getUserAvailabilities
		,getUserEvents
		,getUserExpectedBenefits 	// NO_USAGE_FOUND -- NOTESTT return nothing
		,getUserFollowedPath
		,getUserLinks				// NO_USAGE_FOUND -- NOTESTT return nothing
		,getUserPaths
		,getUserPathProjects
		,getUserStudents
		// DOMAIN MENTOR
		,getMentor
		// SESSION
		,getHistorySessions
		,getHistorySessionsAfter
		,getHistorySessionsBefore
		,getHistorySessionsBetween
		,getPendingSessionsAfter
		,getPendingSessionsBefore
		,getProjectOfSessionP
		,getSessionM
		,getSessionP
		// STUDENT
		,getStudent
		// DOMAIN BOOKING
		,bookStudent
		// DOMAIN PROJECT
		,getProject
		,getProjectCourses
		,getProjectRessources
		,getProjectCourseSections
		// DOMAIN MISC
		,suggestMentor
		// UTILITY
		,convertDurationToSeconds
		// NOT DIRECTLY USED
		,xGet
		,xPost
		// TESTING
		,fetchGet // allow testing url
	};

}

const APIOC = createAPIFactory(create, interceptor);

/*
// tampermonkey only && debug
// NOTESTT: (fr) Permet de lancer les fonctions de l'API
// dans la console alors que le fichier est chargé via tampermonkey
*
if ( typeof unsafeWindow !== 'undefined' ){
	unsafeWindow['APIOC'] = APIOC;
	unsafeWindow['interceptor'] = interceptor;
	unsafeWindow['dayjs'] = dayjs;
}
*/

if ( typeof window !== 'undefined' ){
	window['APIOC'] = APIOC;
}

