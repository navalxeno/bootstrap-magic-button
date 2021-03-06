/* ============================================================
 * bootstrap-magic-button.js v1.0
 * https://github.com/sp4ke/bootstrap-magic-button
 * ============================================================
 * Copyright 2012 Chakib Benziane
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Modified work : bootstrap-button.js v2.0.2
 * Copyright 2012 Twitter, Inc.
 * ============================================================ */!
function ($) {

    "use strict"

    /* BUTTON PUBLIC CLASS DEFINITION
     * ============================== */

    var MagicBtn = function (element, options) {
            this.$element = $(element)

            // The parent Div
            this.$parentDiv = $(element).closest('div')
            this.$parentHeight = this.$parentDiv.outerHeight()
            this.$parentWidth = this.$parentDiv.outerWidth()
            this.$parentPosition = this.$parentDiv.position();
			this.$parentMarginLeft = this.$parentDiv.css('margin-left')
            this.options = $.extend({}, $.fn.magicBtn.defaults, options)
            this.$shown = false
	   
            // Store number of buttons on parent div
            if (!this.$parentDiv.data('nbMagicBtns')) this.$parentDiv.data('nbMagicBtns', 1)
            else this.$parentDiv.data().nbMagicBtns++;

            // Store the current button number
            this.$currentBtnNb = this.$parentDiv.data('nbMagicBtns')

            // store the currunt button size
            this.$height = this.$element.outerHeight() + this.options.betweenSpace / 2
            this.$width = this.$element.outerWidth()

            // current button image and toggle image if there is
            var imgUrl = this.$element.data('image')
            if (typeof(imgUrl) !== 'undefined')
                this.$imgUrl = 'url("' + this.$element.data('image') + '")'
            else
                this.$imgUrl = false
            var toggleimg
            if (toggleimg = this.$element.data('toggle-image')) 
                this.$toggleImgUrl = 'url("' + toggleimg + '")'
            else
                this.$toggleImgUrl = this.$imgUrl

            // store toggle initial status if there is
            var togglestatus
            if (togglestatus = this.$element.data('initial-toggle-status')){
                togglestatus == 'toggled' ? this.toggle() : this.$isToggled = false
            }
            else this.$isToggled = false
            if (this.options.hover) this.addHover()
    }

    MagicBtn.prototype = {

        constructor: MagicBtn

        // state is the option recieved from jQuery plugin
        ,
        setState: function (state) {
            var d = 'disabled',
                $el = this.$element,
                data = $el.data(),
                val = $el.is('input') ? 'val' : 'html'

            state = state + 'Text'
            data.resetText || $el.data('resetText', $el[val]())

            $el[val](data[state] || this.options[state])

            // push to event loop to allow forms to submit
            setTimeout(function () {
                state == 'loadingText' ? $el.addClass(d).attr(d, d) : $el.removeClass(d).removeAttr(d)
            }, 0)
        }

        ,
        calculatePosition: function (direction) {
            this.$parentPosition = this.$parentDiv.position();
            this.$parentMarginLeft = this.$parentDiv.css('margin-left')
            var space = (this.$currentBtnNb === 1) ? 0 : this.options.betweenSpace
            var left = this.$parentPosition.left + this.$parentWidth
            switch (this.options.alignment) {
            case 'top':
                this.$top = (
                (this.$currentBtnNb * this.$height) - this.$height + this.$parentPosition.top + (space * (this.$currentBtnNb - 1)))
                break;
            case 'center':

                if (this.$currentBtnNb === 1) {
                    this.$top = (
                    (this.$parentHeight / 2) - (this.$height / 2) + this.$parentPosition.top)
                    this.$parentDiv.data('top-space', (this.$parentHeight / 2 - (this.$height / 2)))
                    this.$parentDiv.data('bottom-space', (this.$parentHeight / 2 - (this.$height / 2)))
                } else if (this.$currentBtnNb % 2 === 0) {
                    this.$top = (
                    this.$parentDiv.data('top-space') - this.$height + this.$parentPosition.top)
                    this.$parentDiv.data('top-space', this.$parentDiv.data('top-space') - this.$height)
                } else {
                    this.$top = (
                    this.$parentHeight - this.$parentDiv.data('bottom-space') + this.$parentPosition.top)

                    this.$parentDiv.data('bottom-space', this.$parentDiv.data('bottom-space') - this.$height)
                }
                break;
            }
            this.$left = this.$parentPosition.left + this.$parentWidth + parseInt(this.$parentMarginLeft)
        }

        ,
        show: function () {
            this.calculatePosition()
            var $o = this.options
            this.$element.css({
                top: this.$top,
                left: this.$left,
                'background-image': (this.$isToggled) ? this.$toggleImgUrl : this.$imgUrl
            }).show()
            this.$shown = true
        },

        fadeIn: function () {
            this.calculatePosition()
            var $o = this.options
            this.$element.fadeIn('fast').css({
                top: this.$top,
                left: this.$left,
                'background-image': (this.$isToggled) ? this.$toggleImgUrl : this.$imgUrl
            })
            this.$shown = true
        },

        fadeOut: function () {
            this.$element.fadeOut(10)
            this.$shown = false
        },
       
        hide: function () {
            this.$element.hide()
            this.$shown = false
        }

        ,
        toggle: function () {
            var $el = this.$element
            if (!this.$isToggled) {
                if (this.$imgUrl)
                    $el.css('background-image', this.$toggleImgUrl)
                this.$isToggled = true
                $el.addClass('magicBtn-active')
                $el.css('padding-left', function(index,value){
                    return (parseInt(value) + 4) + 'px';
                });
            } else {
                if (this.$imgUrl)
                    $el.css('background-image', this.$imgUrl)
                this.$isToggled = false
                $el.removeClass('magicBtn-active')
                $el.css('padding-left', function(index,value){
                    return (parseInt(value) - 4) + 'px';
                });
            }

        }

        ,
        _hoverInCallback: function () {
            var obj = $(this).data('magicBtn')
            var o = obj.options
            var hoverText = $(this).attr('value')
            var tmpHoverText;
            if (obj.$isToggled){ 
                tmpHoverText = $(this).data('toggle-text')
                if (typeof(tmpHoverText) !== 'undefined')
                    hoverText = tmpHoverText
            }
            if (!obj.$isToggled) {
                $(this).toggleClass('magicBtn-active')
            }
            $('<span class="value">' + hoverText + '</span>').
            hide().appendTo($(this)).fadeIn()
        }
        ,

        _hoverOutCallback: function () {
            var obj = $(this).data('magicBtn')
            var o = obj.options
            var $el = $(this)
            if ((!obj.$isToggled) && (!$el.is(':hover')) && ($el.hasClass('magicBtn-active'))){
                $(this).toggleClass('magicBtn-active', 100)
            }
            $(this).find('.value').fadeOut('slow').remove()
        }
        ,

        addHover: function () {
            var $el = this.$element
            var config = {
                over: this._hoverInCallback,
                timeout: 10,
                interval: 10,
                out: this._hoverOutCallback
            }
            $el.hoverIntent(config)

        }

    }


    /* BUTTON PLUGIN DEFINITION
     * ======================== */

    $.fn.magicBtn = function (option) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('magicBtn'),
                options = typeof option == 'object' && option
            if (!data) $this.data('magicBtn', (data = new MagicBtn(this, options)))
            data.calculatePosition('right')
            if (option == 'toggle') data.toggle()
            if (option == 'show') data.show()
            if (option == 'fadeIn') data.fadeIn()
            if (option == 'fadeOut') data.fadeOut()
            if (option == 'hide') data.hide()
            //else if (option) data.setState(option)

        })
    }

    $.fn.magicBtn.defaults = {
        direction: 'right',
        betweenSpace: 2,
        alignment: 'center',
        hover: false,
        hoverText: false
    }

    $.fn.magicBtn.Constructor = MagicBtn


    /* BUTTON DATA-API
     * =============== */

    $(function () {
        $('body').on('click.magicBtn.data-api', '[data-toggle^=magicBtn]', function (e) {
            var $btn = $(e.target)
            if (!$btn.hasClass('magicBtn')) $btn = $btn.closest('.magicBtn')
            $btn.magicBtn('toggle')
        })
    })

}(window.jQuery);
