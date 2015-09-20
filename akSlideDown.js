(function( $ ) {

	var methods = {
		init : function( options ) {
			// инициализация плагина c пользовательскими настройками настройками
			var pluginOptions = $.extend( {
				container:'page', //класс абсолютно позиционированного контейнера, относительно которого будут позиционироваться открытые блоки контента
				width: '', // ширина блока, по умолчанию "auto"
				headerHeight: '50',// высота заголовка
				buttonImg: '', // Кнопка развертывания
				buttonImgSpriteHeight: '', // высота спрайта кнопки развертывания
				buttonImgSpriteWidth: '', // высота спрайта кнопки развертывания
				buttonOpenText:'Развернуть',
				buttonCloseText:'Скрыть',
				articleHeight: 120, // высота свернутой контентной части блока
				animationTime:300, //время анимации эффектов открытия и закрытия контентной области
				touchScreenMode:'false', //дополнительный вид адаптированный для устройств с тачскрином, включая все мобильные устройства
				state : 'closed', //начальное состояние блока доступные значения: opened , closed
				onOpen : function(settings){},
				onClose : function(settings){}
			}, options);

			return this.each(function() {
				var $this = $(this),
					data = $this.data('akSlideDown'),
					buttonOpen,
					buttonClose,
					block={};
				if(data){
					methods.destroy.call( $this );
					data = $this.data('akSlideDown')
				}
				data = $.extend(data,pluginOptions);
				data = $.extend(data,{'initData':pluginOptions});
				if(!data.buttonOpen){
					if(data.buttonImg && !data.buttonImgSpriteHeight){
						buttonOpen = $('<div><img /></div>');
						buttonOpen
							.attr({
								'class' : "akSlideDownButtonOpen img"
							})
							.find('img').attr({
								'src': data.buttonImg,
								'title' : pluginOptions.buttonOpenText,
								'alt' : pluginOptions.buttonOpenText
							})
					}else if ( data.buttonImg && data.buttonImgSpriteHeight ) {
						buttonOpen = $('<div/>');
						buttonOpen
							.attr({
								'title' : pluginOptions.buttonOpenText,
								'class' : "akSlideDownButtonOpen img"
							})
							.css({
								'background':'transparent url("'+data.buttonImg+'") left top no-repeat',
								'height': data.buttonImgSpriteHeight,
								'width': data.buttonImgSpriteWidth
							})
					}else{
						buttonOpen = $('<div />', {
							'text' : pluginOptions.buttonOpenText,
							'class' : "akSlideDownButtonOpen"
						});
					}
					buttonOpen.bind('click.akSlideDown', function() {
						methods.open.call($this, data.animationTime )
					});
					data = $.extend(data,{
						buttonOpen : buttonOpen
					});
					$this.append(buttonOpen);
				}
				if(!data.buttonClose){
					if(data.buttonImg && !data.buttonImgSpriteHeight){
						buttonClose = $('<div><img /></div>');
						buttonClose
							.attr({
								'class' : "akSlideDownButtonClose img"
							})
							.find('img').attr({
								'src': data.buttonImg,
								'title' : pluginOptions.buttonCloseText,
								'alt' : pluginOptions.buttonCloseText
							})
					}else if ( data.buttonImg && data.buttonImgSpriteHeight ) {
						buttonClose = $('<div/>');
						buttonClose
							.attr({
								'title' : pluginOptions.buttonCloseText,
								'class' : "akSlideDownButtonClose img"
							})
							.css({
								'background':'transparent url("'+data.buttonImg+'") left bottom no-repeat',
								'height': data.buttonImgSpriteHeight,
								'width': data.buttonImgSpriteWidth
							})
					}else{
						buttonClose = $('<div />', {
							'text' : pluginOptions.buttonCloseText,
							'class' : "akSlideDownButtonClose"
						});
					}
					buttonClose.bind('click.akSlideDown', function() {
						methods.close.call($this, data.animationTime )
					});
					data = $.extend(data,{
						buttonClose : buttonClose
					});
					$this.append(buttonClose);
				}
				block.borderLeftWidth = (parseInt($(this).css('border-left-width'))>0)? parseInt($(this).css('border-left-width')) : 0;
				block.borderRightWidth = (parseInt($(this).css('border-right-width'))>0)? parseInt($(this).css('border-right-width')) : 0;

				$this
					.find("header")
					.height(pluginOptions.headerHeight)
					.parent()
					.addClass("akSlideDown")
					.width(pluginOptions.width);
				if(data.width){
					$this.innerWidth($this.width() - block.borderLeftWidth - block.borderRightWidth )
				}
				data = $.extend(data,{
					openBlockHeight : $this.height()
				});
				$this
					.find('article')
					.height(pluginOptions.articleHeight)
					.parent()
					.height($this.height())
					.data('akSlideDown', data );
				if(data.state==='opened'){
					methods.open.call($this, data.animationTime )
				}
			});

		},
		destroy : function( args ) {
			return this.each(function(){
				var $this = $(this),
					data = $this.data('akSlideDown');
				if(!data){
					console.log ( 'Невозможно удалить данные плагина, потому что плагин jQuery.akSlideDown не инициализирован для элемента: ' +  this );
					return this;
				}
				if(data.state==='running'){
					$.error( 'Невозможно удалить данные плагина, потому что плагин jQuery.akSlideDown в данный момент заблокирован ' );
					return this;
				}

				$this
					.removeData('akSlideDown')
					.removeClass('akSlideDown opened')
					.removeAttr('style')
					.find("header")
					.removeAttr('style')
					.parent()
					.find('article')
					.removeAttr('style');
				if(data.buttonClose){
					data.buttonClose.remove();
				}
				if(data.bolvanka){
					data.bolvanka.remove();
				}
				if(data.buttonOpen){
					data.buttonOpen.removeAttr('style');
				}
				$(window).unbind('.akSlideDown');
				if(data.buttonOpen){
					data.buttonOpen.remove();
				}
			})
		},
		open : function( time ) {
			// метод открытия
			return this.each(function() {
				var data = $(this).data('akSlideDown');
				if(!data){
					console.log( 'Плагин jQuery.akSlideDown не инициализирован для элемента: ' +  this );
					return this;
				}
				var container = $(this).parents("."+data.container),
					cleanWidth,
					cleanHeight,
					currentPos = $(this).offset(),
					containerCurrPos = $(this).parents("."+data.container).offset(),
					bolvanka = $('<div />', {
						'text' : ' ',
						'class' : "akSlideDownO " + $(this).attr('class'),
						'height':$(this).height(),
						'width' : $(this).width()
					}),
					block={},
					zIndex;
				data.onOpen(data.initData);
				data.state='running';

				//задание размеров с проверкой на их существование из-за ИЕ
				block.borderBottomWidth = (parseInt($(this).css('border-bottom-width'))>0)? parseInt($(this).css('border-bottom-width')) : 0;
				block.borderTopWidth = (parseInt($(this).css('border-top-width'))>0)? parseInt($(this).css('border-top-width')) : 0;
				block.borderLeftWidth = (parseInt($(this).css('border-left-width'))>0)? parseInt($(this).css('border-left-width')) : 0;
				block.borderRightWidth = (parseInt($(this).css('border-right-width'))>0)? parseInt($(this).css('border-right-width')) : 0;
				block.PaddingTop = (parseInt($(this).css('padding-top'))>0)? parseInt($(this).css('padding-top')) : 0;
				block.PaddingBottom = (parseInt($(this).css('padding-bottom'))>0)? parseInt($(this).css('padding-bottom')) : 0;
				block.PaddingRight = (parseInt($(this).css('paddingRight'))>0)? parseInt($(this).css('paddingRight')) : 0;
				block.PaddingLeft = (parseInt($(this).css('paddingLeft'))>0)? parseInt($(this).css('paddingLeft')) : 0;
				block.articlePaddingRight=(parseInt($(this).find('article').css('paddingRight'))>0)? parseInt($(this).find('article').css('paddingRight')) : 0;
				block.articleMarginRight=(parseInt($(this).find('article').css('marginRight'))>0)? parseInt($(this).find('article').css('marginRight')) : 0;
				block.headerMarginRight=(parseInt($(this).find('header').css('marginRight'))>0)? parseInt($(this).find('header').css('marginRight')) : 0;
				container.borderTopWidth = (parseInt(container.css('border-top-width'))>0)? parseInt(container.css('border-top-width')) : 0;
				container.borderLeftWidth = (parseInt(container.css('border-left-width'))>0)? parseInt(container.css('border-left-width')) : 0;
				container.PaddingTop = (parseInt(container.css('padding-top'))>0)? parseInt(container.css('padding-top')) : 0;
				data.buttonClose.borderBottomWidth = (parseInt($(data.buttonClose).css('border-bottom-width'))>0)? parseInt($(data.buttonClose).css('border-bottom-width')) : 0;
				data.buttonClose.borderTopWidth = (parseInt($(data.buttonClose).css('border-top-width'))>0)? parseInt($(data.buttonClose).css('border-top-width')) : 0;
				cleanWidth = (!data.width)? ($(this).parent().width() - block.PaddingLeft - block.PaddingRight - block.borderRightWidth - block.borderLeftWidth):($(this).width());
				zIndex = Math.round(container.height() - currentPos.top + containerCurrPos.top + container.borderTopWidth);
				cleanHeight = Math.round(container.height() - block.PaddingTop - block.PaddingBottom - block.borderTopWidth - block.borderBottomWidth - currentPos.top + containerCurrPos.top + container.borderTopWidth + container.PaddingTop );

				if(!data.bolvanka){
					data = $.extend(data,{
						bolvanka : bolvanka
					});
					data.bolvanka.removeClass('test');
					$(this).before(bolvanka);
				}
				if(cleanHeight < (data.openBlockHeight + data.buttonClose.borderBottomWidth + data.buttonClose.borderTopWidth + data.buttonClose.innerHeight() )){
					data.scrolled='true';
					$(this).find('article')
						.css('margin-bottom',(data.buttonClose.borderBottomWidth + data.buttonClose.borderTopWidth + data.buttonClose.innerHeight()));
				}else{
					cleanHeight = data.openBlockHeight + data.buttonClose.borderBottomWidth + data.buttonClose.borderTopWidth + data.buttonClose.innerHeight();
				}
				data.buttonOpen.initWidth=data.buttonOpen.width();
				$(data.buttonOpen).animate({'opacity': 0, width: data.buttonClose.width()},time,function(){data.buttonOpen.css('width',data.buttonOpen.initWidth)});
				$(data.buttonClose)
					.css({'z-index': zIndex + 1})
					.animate({'opacity': 1},time);
				$(this)
					.addClass("opened")
					.css({
						'top': Math.round(currentPos.top - containerCurrPos.top - container.borderTopWidth),
						'left': Math.round(currentPos.left - containerCurrPos.left - container.borderLeftWidth),
						'width': cleanWidth,
						'z-index': zIndex
					})//todo сделать позиционирование относительно ближайшего позиционированного нестатичного элемента, а не обязательно относительно container-a
					.animate(
						{'height': cleanHeight },
						time,
						function(){
							$(data.buttonOpen).css('z-index' , -1 );
							data.buttonClose.detach();
							data.state='opened';
							$(this)
								.addClass("overflow")
								.before(data.buttonClose);
							$(data.buttonClose).css({
								'bottom' : 'auto',
								'top' : Math.round(currentPos.top - containerCurrPos.top - container.borderTopWidth + block.borderTopWidth + $(this).innerHeight() - $(data.buttonClose).innerHeight() - data.buttonClose.borderBottomWidth - data.buttonClose.borderTopWidth - 5),
								'left' : Math.round(currentPos.left - containerCurrPos.left - container.borderLeftWidth + block.borderLeftWidth + 5)
							}); //todo сделать положение кнопки закрытия зависящим только от css
							if(data.scrolled){
								var scrollWidth= this.offsetWidth - this.clientWidth - block.borderRightWidth - block.borderLeftWidth;
								if((scrollWidth!=0)&&(flagDvinut!='true')){
									$(this).find('article')
										.css({
											'margin-right': block.articleMarginRight-scrollWidth
										})
										.parent()
										.find('header')
										.css({
											'margin-right': block.headerMarginRight-scrollWidth
										});
								}
							}
							$(this).data('akSlideDown', data );
						}
					);
				if(data.scrolled){
					var scrollWidth= this.offsetWidth - this.clientWidth - block.borderRightWidth - block.borderLeftWidth,
						flagDvinut='false';
					if(scrollWidth!=0){
						flagDvinut="true";
						$(this).find('article')
							.css({
								'margin-right': block.articleMarginRight-scrollWidth
							})
							.parent()
							.find('header')
							.css({
								'margin-right': block.headerMarginRight-scrollWidth
							});
					}
				}
			});
		},
		close : function( time ) {
			// метод закрытия
			return this.each(function() {
				var data = $(this).data('akSlideDown'),
					block={};
				if(!data){
					console.log ( 'Плагин jQuery.akSlideDown не инициализирован для элемента: ' +  this );
					return this;
				}
				if (data.state!=='opened'){
					console.log( 'Невозможно закрыть неоткрытый элемент : ' +  this );
					return this;
				}

				//задание размеров с проверкой на их существование из-за ИЕ
				block.borderBottomWidth = (parseInt($(this).css('border-bottom-width'))>0)? parseInt($(this).css('border-bottom-width')) : 0;
				block.borderTopWidth = (parseInt($(this).css('border-top-width'))>0)? parseInt($(this).css('border-top-width')) : 0;
				block.borderLeftWidth = (parseInt($(this).css('border-left-width'))>0)? parseInt($(this).css('border-left-width')) : 0;
				block.borderRightWidth = (parseInt($(this).css('border-right-width'))>0)? parseInt($(this).css('border-right-width')) : 0;
				block.PaddingTop = (parseInt($(this).css('padding-top'))>0)? parseInt($(this).css('padding-top')) : 0;
				block.PaddingBottom = (parseInt($(this).css('padding-bottom'))>0)? parseInt($(this).css('padding-bottom')) : 0;
				block.PaddingRight = (parseInt($(this).css('paddingRight'))>0)? parseInt($(this).css('paddingRight')) : 0;
				block.PaddingLeft = (parseInt($(this).css('paddingLeft'))>0)? parseInt($(this).css('paddingLeft')) : 0;
				block.articlePaddingRight=(parseInt($(this).find('article').css('paddingRight'))>0)? parseInt($(this).find('article').css('paddingRight')) : 0;
				block.articleMarginRight=(parseInt($(this).find('article').css('marginRight'))>0)? parseInt($(this).find('article').css('marginRight')) : 0;
				block.headerMarginRight=(parseInt($(this).find('header').css('marginRight'))>0)? parseInt($(this).find('header').css('marginRight')) : 0;

				data.state='running';
				data.onClose(data.initData);
				$(data.buttonOpen).animate({'opacity': 1},time).css('z-index' , '');
				data.buttonClose.initWidth=data.buttonClose.width();
				$(data.buttonClose)
					.css({
						'bottom' : '',
						'left' : '',
						'top': ''
					})
					.animate({'opacity': 0, width: data.buttonOpen.width()},time,function(){data.buttonClose.css('width',data.buttonClose.initWidth)})
					.detach();
				$(this)
					.scrollTop(0)
					.find('article')
					.css({'margin-bottom':''})
					.parent()
					.append(data.buttonClose)
					.animate(
						{'height': data.bolvanka.height()},
						time,
						function(){
							$(data.buttonClose).css({
								'z-index' : ''
							});
							$(data.bolvanka).remove();
							data = $.extend(data,{
								bolvanka : ''
							});
							data.state='closed';
							$(this)
								.removeClass('opened overflow')
								.css({
									'top': '',
									'left': ''
								})
								.data('akSlideDown', data );
							if(data.scrolled){
								var scrollWidth= this.offsetWidth - this.clientWidth - block.borderRightWidth - block.borderLeftWidth;
								if(scrollWidth==0){
									$(this)
										.find('article')
										.css({'margin-right':''})
										.parent()
										.find('header')
										.css({'margin-right':''});
								}
							}
						}
					);
				if(data.scrolled){
					var scrollWidth= this.offsetWidth - this.clientWidth - block.borderRightWidth - block.borderLeftWidth;
					if(scrollWidth==0){
						$(this).find('article')
							.css({
								'margin-right': ''
							})
							.parent()
							.find('header')
							.css({
								'margin-right': ''
							});
					}
				}
			});
		}
	};

	$.fn.akSlideDown = function( method ) {
		if ( methods[method] ) {
			return methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Метода с именем ' +  method + ' не существует для плагина jQuery.akSlideDown' );
		}
	};
})(jQuery);
