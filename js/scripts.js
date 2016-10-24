// =========================
//  Mapa Eleciones EU 2016
// =========================
	// Colores
	const democrats = '#335F9A';
	const casiDemocrats = '#3D88BB';
	const medio = '#FFF3D0';
	const casirepublicans = '#FC6258';
	const republicans = '#D7372F';
	const inactivo = '#fff';

	var generalColor = inactivo;

	// Arreglo general de estados
	// -------------------
	var mapStates = [];
	const mapStyles = [{featureType:'all',elementType:'labels',stylers:[{visibility:'off'}]},{featureType:'administrative.country',elementType:'all',stylers:[{visibility:'on'}]},{featureType:'administrative.country',elementType:'geometry',stylers:[{visibility:'on'}]},{featureType:'administrative.country',elementType:'labels',stylers:[{visibility:'off'}]},{featureType:'administrative.province',elementType:'all',stylers:[{visibility:'on'}]},{featureType:"administrative.province",elementType:"geometry",stylers:[{visibility:"off"}]},{featureType:"administrative.province",elementType:"labels",stylers:[{visibility:"on"}]},{featureType:"administrative.province",elementType:"labels.text",stylers:[{visibility:"on"},{saturation:"-6"},{lightness:"-7"},{gamma:"1"},{weight:"3.65"}]},{featureType:"administrative.province",elementType:"labels.text.fill",stylers:[{visibility:"on"},{weight:"0.01"}]},{featureType:"administrative.province",elementType:"labels.text.stroke",stylers:[{visibility:"off"}]},{featureType:"administrative.locality",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"administrative.neighborhood",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"administrative.land_parcel",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"landscape.man_made",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"landscape.natural",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"poi",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"poi.park",elementType:"geometry.fill",stylers:[{color:"#aadd55"}]},{featureType:"road",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"road.highway",elementType:"labels",stylers:[{visibility:"on"}]},{featureType:"road.arterial",elementType:"labels.text",stylers:[{visibility:"on"}]},{featureType:"road.local",elementType:"labels.text",stylers:[{visibility:"on"}]},{featureType:"transit",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"water",elementType:"all",stylers:[{visibility:"on"},{saturation:"-13"},{lightness:"20"},{gamma:"1.30"},{hue:"#0078ff"}]},{featureType:"water",elementType:"geometry.fill",stylers:[{color:"#0078ff"},{saturation:"-20"},{lightness:"30"},{gamma:"1.40"}]}];

	var centerEUA = new google.maps.LatLng(39.8333333,-98.585522); // centro de EU segun wikipedia
	var defaultZoom = ($(document).width() < 1100) ? 3 : 4;

	var map = new google.maps.Map(document.getElementById('mapa-elecciones'), {
		zoom: defaultZoom,
		center: centerEUA,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		styles: mapStyles
	});

	var infoWindow = new google.maps.InfoWindow;

	// Funcion de genetracion del mapa
	// -------------------
	var mapGenerate = function() {
		mapStates.forEach(function(poligonItem) {

			var stateCoords = [];
			poligonItem.points.forEach(function(point) {
				stateCoords.push(new google.maps.LatLng(point.lat, point.long))
			});

			var colorState = inactivo;

			var statePoligon = new google.maps.Polygon({
					paths: stateCoords,
					strokeColor: colorState,
					strokeOpacity: 0.9,
					strokeWeight: 1,
					fillColor: colorState,
					fillOpacity: 0.5
			});

			statePoligon.name = poligonItem.name
			statePoligon.color = colorState
			statePoligon.data = poligonItem.data

			google.maps.event.addListener(statePoligon,"click",function(){

					if (this.fillColor != generalColor) {
						this.setOptions({
							fillColor: generalColor,
							strokeColor: generalColor,
							fillOpacity: 1
						});
					}else{
						var bounds = new google.maps.LatLngBounds()
						this.getPath().forEach(function(element,index){
							bounds.extend(element)
						})

						var contentString = '<div id="map-info-container">';
						contentString += '<ul>';
						contentString += '<h1>'+this.name+'</h1>';
						this.data.forEach(function(Item, i) {
							var styleElement = ( i == 0 || i == 1 ) ? 'class="element" style="background-color: '+ generalColor +';"' : "" ;
							contentString += '<li '+ styleElement +'>'+ Item+'</li>';
						});
						contentString += '<ul></div>';
						var centerState = bounds.getCenter();
						infoWindow.setContent(contentString);
						infoWindow.setPosition(centerState);
						infoWindow.open(map);
						map.setZoom(5);
						map.panTo(centerState);
					}
			});

			google.maps.event.addListener(statePoligon,"mouseout",function(){
				this.setOptions({fillOpacity: 0.5});
			});

			statePoligon.setMap(map);
		}, this);
	}

	//Get Color
	function getColor(id) {
		switch (parseInt(id)) {
			case 0:
				color = democrats;
				break;
			case 1:
				color = casiDemocrats;
				break;
			case 2:
				color = medio;
				break;
			case 3:
				color = casirepublicans;
				break;
			case 4:
				color = republicans;
				break;
			default:
				color = inactivo;

		}
		return color ;
	}
	// Ready
	// -------------------
	$( document ).ready(function() {

		// Se obtine el Json de Cordenadas
		// -------------------
		$.getJSON('json/map-eu.json', function(data) {
			data.states.forEach(function(state) {
				mapStates.push(state)
			});

			google.maps.event.addDomListener(window, 'load', mapGenerate());
		})

		$('.counter-elecciones button').click(function( event ){
			var newStateColor = getColor( this.id.substring(6) );
			if ( $( '#' + this.id).hasClass( 'active' ) ) {
				$('#' + this.id).removeClass('active');
				map.setZoom(defaultZoom);
				map.panTo(centerEUA);
				infoWindow.close(map);
				generalColor = inactivo;
			}else{
				$('.counter-elecciones button').removeClass( 'active' );
				$('#' + this.id).addClass('active');
				generalColor = getColor( this.id.substring(6) ) ;
			}
		});

	});
