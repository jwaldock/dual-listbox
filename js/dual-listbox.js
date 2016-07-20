(function($) {
    // What does the dualListBox plugin do?
    $.fn.dualListBox = function(options) {
        if (!this.length) { return this; }

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
            updateCounter('.from');
            updateCounter('.to');
        }

        var updateButton = function(list, oneBtn, allBtn) {
            $(allBtn).prop('disabled', !$('option:visible', list).length);
            $(oneBtn).prop('disabled', !$('option:visible:selected', list).length);
        }

        var updateButtons = function() {
            updateButton('.from', '.move-to', '.move-all-to');
            updateButton('.to', '.move-from', '.move-all-from');
        }

        return this.each(function() {
            var $this = $(this);
            $('.move-from').click(function(event) {
                move(true, '.to', '.from');
            });

            $('.move-to').click(function(event) {
                move(true, '.from', '.to');
            });

            $('.move-all-from').click(function(event) {
                move(false, '.to', '.from');
            });

            $('.move-all-to').click(function(event) {
                move(false, '.from', '.to');
            });

            var thread = null;

            $('.dual-list-filter').keydown(function(event) {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if(keycode != '13'){
                    clearTimeout(thread);
                    var $this = $(this); 
                    thread = setTimeout(function() {
                        filter('.from', $this.val());
                    }, 500);
                }
            });

            $('.from').keydown(function(event) {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if(keycode == '13'){
                    move(true, '.from', '.to');
                }
            });

            $('.to').keydown(function(event) {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if(keycode == '13'){
                    move(true, '.to', '.from');
                }
            });
            $('select').click(updateButtons);
            $('select').keydown(updateButtons);
            updateResultCounters();
            updateButtons();
        });
    };

    // default options
    $.fn.dualListBox.defaults = {
        delay: 100
    };
    $('.dual-list').dualListBox();
})(jQuery);
