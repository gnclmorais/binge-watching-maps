import dynamic from 'next/dynamic';
import { memo, Component } from 'react';

import PlacesList from '@/components/PlacesList';

export default class MapPage extends Component {
  constructor(props) {
    super(props);

    this.mapData = props.mapData;
    this.formattedMarkers = this.mapData.markers.map(({ id, name, place, address, tagged_pins }) => {
      return {
        id,
        position: [place.lat, place.lng],
        description: name,
        address: place.address,
        tagged_pins
      };
    });
  }

  highlight = (id) => this.setState({ highlightedMarker: id });

  render() {
    const MapWithNoSSR = dynamic(() => import('@/components/map'), { ssr: false });
    const MemoizedMap = memo((props) => <MapWithNoSSR {...props} />);

    // Get child's method that changes its state to pass it on to on of its
    // siblings, preventing re-renders of the parent component:
    let highlightMarkerFn = null;
    let selectLabelFn = null;
    const onPlacesListMount = ({ callbackToHighlightMarker, setSelectedLabel }) => {
      console.log('onPlacesListMount');

      highlightMarkerFn = callbackToHighlightMarker;
      selectLabelFn = setSelectedLabel;
    }

    return (
      <>
        <p className="flex-grow-0 flex-shrink">
          Map: <strong>{this.mapData.title}</strong> (<em>{this.mapData.subtitle}</em>)
          <br />
          {this.formattedMarkers.length} places
        </p>

        <div className="flex-grow flex flex-row overflow-y-hidden">
          <div className="overflow-y-scroll w-96 md:w-1/3 xl:w-1/4">
            <PlacesList
              markers={this.formattedMarkers}
              onMount={onPlacesListMount}
            />
          </div>
          <div className="flex-grow">
            <MemoizedMap
              markers={this.formattedMarkers}
              setHighlightedMarker={(id) => highlightMarkerFn(id)}
            />
          </div>
        </div>
      </>
    )
  }
}
