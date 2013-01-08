/* ==========================================================
 * sco.modal.js
 * http://github.com/terebentina/sco.js
 * ==========================================================
 * Copyright 2012 Dan Caragea.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */

/*jshint laxcomma:true, sub:true, browser:true, jquery:true, devel:true, eqeqeq:false */
/*global define:true, Spinner:true */

(function(factory) {
	"use strict";

    if (typeof define === 'function' && define.amd) {
        // Register as an anonymous AMD module:
        define([
            'jquery'
			,'../spin.js'
        ], factory);
    } else {
        // Browser globals:
        factory(window.jQuery);
    }
}(function($) {
	"use strict";

	function Modal(options) {
		options = $.extend({}, $.fn.scomodal.defaults, options);

		var $modal = $(options.target).attr('class', 'modal fade')
			,$backdrop = $('.modal-backdrop')
			,$content_wrapper
			,title
			;

		if (!$modal.length) {
			$modal = $('<div class="modal fade" id="'+options.target.substr(1)+'"><div class="modal-header"><a class="close" href="#" data-dismiss="modal">×</a><h3>&nbsp;</h3></div><div class="inner"/></div>').appendTo('body');
		}
		title = options.title;
		if (title === '') {
			title = '&nbsp;';
		}
		$modal.find('.modal-header h3').html(title);

		if (typeof options.cssclass !== 'undefined') {
			$modal.addClass(options.cssclass);
		}

		if (typeof options.width !== 'undefined') {
			$modal.width(options.width);
		}

		if (typeof options.left !== 'undefined') {
			$modal.css({'left': options.left});
		}

		if (typeof options.height !== 'undefined') {
			$modal.height(options.height);
		}

		if (typeof options.top !== 'undefined') {
			$modal.css({'top': options.top});
		}

		if (!$backdrop.length) {
			$backdrop = $('<div class="modal-backdrop fade" />').appendTo(document.body);
			title = $backdrop[0].offsetWidth; // force reflow. "title = " is not needed but I added it just to avoid jshint warnings
			$backdrop.addClass('in');
		}
		$content_wrapper = $modal.find('.inner');
		$modal.off('close.scomodal').on('close.scomodal', function() {
			$modal.hide().off('close.scomodal');
			$content_wrapper.html('');
			$('.modal-backdrop').remove();
			if (typeof options.onClose === 'function') {
				options.onClose.call(this, options);
			}
		}).show().addClass('in');

		if (typeof options.href !== 'undefined') {
			var spinner = new Spinner({color: '#3d9bce'}).spin($modal[0]);
			$content_wrapper.load(options.href, function() {
				spinner.stop();
			});
		} else {
			$content_wrapper.html(options.content);
		}
	}


	$.fn.scomodal = function(opts) {
		return this.each(function() {
			var $this = $(this)
				,data = $this.data()
				,options = $.extend({}, data, opts)
				;
			if ($this.attr('href') !== '' && $this.attr('href') != '#') {
				options.href = $this.attr('href');
			}
			new Modal(options);
		});
	};

	$.scomodal = function(options) {
		return new Modal(options);
	};

	$.fn.scomodal.defaults = {
		title: '&nbsp;'		// modal title
		,target: '#modal'	// the modal id. MUST be an id for now.
		,content: ''		// the static modal content (in case it's not loaded via ajax)
	};

	$(document).on('click.scomodal', '[data-trigger="modal"]', function() {
		$(this).scomodal();
		if ($(this).is('a')) {
			return false;
		}
	}).on('click.scomodal', '[data-dismiss="modal"]', function(e) {
		e.preventDefault();
		$(this).parents('.modal').trigger('close');
	});
}));
