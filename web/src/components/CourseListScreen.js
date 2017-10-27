import React, { Component } from 'react';
import { GridList, GridTile } from 'material-ui/GridList';

const tilesData = [
  { title: 'Breakfast', author: 'jill111', },
  { title: 'Tasty burger', author: 'pashminu', },
  { title: 'Camera', author: 'Danson67', },
  { title: 'Morning', author: 'fancycrave1', },
  { title: 'Hats', author: 'Hans', },
  { title: 'Honey', author: 'fancycravel', },
  { title: 'Vegetables', author: 'jill111', },
  { title: 'Water plant', author: 'BkrmadtyaKarki', },
];

class CourseListScreen extends Component {
  render() {
    return (
      <div>
        <h1>Courses</h1>
        <div style={styles.listWrapper}>
          <GridList
            cellHeight={180}
            cols={4}
            style={styles.list}
          >
            {tilesData.map(x => (
              <GridTile
                key={x.title}
                title={x.title}
                subtitle={x.author}
                style={styles.tile}
              />
            ))}
          </GridList>
        </div>
      </div>
    );
  }
}

const styles = {
  listWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  list: {
    width: 960,
  },
  tile: {
    backgroundColor: '#663399',
  },
};

export default CourseListScreen;
