(function($) {
    // What does the dualListBox plugin do?
    $.fn.dualListBox = function(options) {
        var settings = $.extend(true, {}, $.fn.dualListBox.defaults, options);

        var filter = function(list, search) {
            var regex = new RegExp(search, 'gi');
            var $items = $('option', list);
            $.each($items, function() {
                var $item = $(this);
                if($item.text().match(regex) === null) {
                    $item.hide();
                } else {
                    $item.show();
                }
            });
            updateResultCounters();
            updateButtons();
        }

        var sortOptions = function (items) {
            return items.sort(function(a, b){
                var aText = $(a).text(), bText = $(b).text();
                if(aText == bText) return 0;
                return aText > bText ? 1 : -1;
            });
        }

        var move = function(selected, from, to) {
            var items = $().add($(selected ? 'option:selected:visible' : 'option:visible', from)).add($('option', to));                
            items.prop('selected', false);
            $(to).html(sortOptions(items));
            updateResultCounters();
            updateButtons();
        }

        var updateCounter = function(list) {
            var count = $('option:visible', list).length;
            var $filterResults = $(list).siblings('.filter-results');
            $('.results', $filterResults).text(count);            
        }

        var updateResultCounters = function() {
            updateCounter(settings.origin);
            updateCounter(settings.destination);
        }

        var updateButton = function(list, oneBtn, allBtn) {
            $(allBtn).prop('disabled', !$('option:visible', list).length);
            $(oneBtn).prop('disabled', !$('option:visible:selected', list).length);
        }

        var updateButtons = function() {
            updateButton(settings.origin, settings.oneDestination, settings.allDestination);
            updateButton(settings.destination, settings.oneOrigin, settings.allOrigin);
        }

        return this.each(function() {
            var $this = $(this);
            $(settings.oneOrigin).click(function(event) {
                move(true, settings.destination, settings.origin);
            });

            $(settings.oneDestination).click(function(event) {
                move(true, settings.origin, settings.destination);
            });

            $(settings.allOrigin).click(function(event) {
                move(false, settings.destination, settings.origin);
            });

            $(settings.allDestination).click(function(event) {
                move(false, settings.origin, settings.destination);
            });

            var thread = null;

            $('.dual-list-filter').keydown(function(event) {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if(keycode != '13'){
                    clearTimeout(thread);
                    var $this = $(this); 
                    thread = setTimeout(function() {
                        filter(settings.origin, $this.val());
                    }, settings.delay);
                }
            });

            var attachMoveOnEnter = function(from, to) {
                $(from).keydown(function(event) {
                    var keycode = (event.keyCode ? event.keyCode : event.which);
                    if(keycode == '13'){
                        move(true, from, to);
                    }
                });                
            }

            attachMoveOnEnter(settings.destination, settings.origin);
            attachMoveOnEnter(settings.origin, settings.destination);

            $('select').change(updateButtons);
            updateResultCounters();
            updateButtons();
        });
    };

    // default options
    $.fn.dualListBox.defaults = {
        delay: 100,
        origin: '.origin',
        destination: '.dest',
        allOrigin: '.all-to-origin',
        oneOrigin: '.one-to-origin',
        allDestination: '.all-to-dest',
        oneDestination: '.one-to-dest'
    };
    $('.dual-list').dualListBox();
})(jQuery);
