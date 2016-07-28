(function($) {
    'use strict';

    $.fn.dualListBox = function(options) {
        var defaults = function ($listBox) {
            return {
                delay: $listBox.data('delay') || 200,
                sort: $listBox.data('sort') || true
            }
        };

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
        };

        var sortOptions = function (items) {
            return items.sort(function(a, b){
                var aText = $(a).text(), bText = $(b).text();
                if (aText == bText) {
                    return 0;
                }
                return aText > bText ? 1 : -1;
            });
        };

        var update = function($listBox) {
            // update lists' counters
            $listBox.find('[data-list-count]').each(function() {
                var $results = $(this),
                    $list = $listBox.find('select[data-list="' + $results.data('list-count') + '"]');
                $results.text($('option:visible', $list).length)
            });

            // update button disabled status
            $listBox.find('button[data-move]').each(function() {
                var $options,
                    $button = $(this),  
                    $list = $listBox.find('select[data-list!="' + $button.data('move-to') + '"]');

                if ($button.data('move') == 'all') {
                    $button.prop('disabled', !$('option:visible', $list).length);
                } else if ($button.data('move') == 'selected') {
                    $button.prop('disabled', !$('option:visible:selected', $list).length);
                }
            });
        };

        return this.each(function() {
            var $listBox = $(this);
            var settings = $.extend(true, {}, defaults($listBox), $listBox, options);

            $listBox.find('button[data-move]').click(function(e) {
                var selected, items, 
                    $button = $(this),
                    from = 'select[data-list!="' + $button.data('move-to') + '"]',
                    to = 'select[data-list="' + $button.data('move-to') + '"]';

                if ($button.data('move') == 'selected') {
                    items = $('option:selected:visible', $listBox.find(from));
                } else if ($button.data('move') == 'all') {
                    items = $('option:visible', $listBox.find(from));
                }

                items = items.add($('option', $listBox.find(to)));  
                items.prop('selected', false);
                $listBox.find(to).html(settings.sort ? sortOptions(items) : items);
                update($listBox);
            });

            var thread = null;
            $('input[data-filter]').keydown(function(event) {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if(keycode != '13'){
                    clearTimeout(thread);
                    var $filterBox = $(this); 
                    thread = setTimeout(function() {
                        filter('select[data-list="' + $filterBox.data('filter') + '"]', $filterBox.val());
                        update($listBox);
                    }, settings.delay);
                }
            });

            $listBox.find('select[data-list]').change( function() { update($listBox) } );

            update($listBox);
        });
    };
    
    $('div[data-role="dual-listbox"]').dualListBox();
})(jQuery);
