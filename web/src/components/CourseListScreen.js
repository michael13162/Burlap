import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { GridList, GridTile } from 'material-ui/GridList';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';


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
      <div style={styles.screenWrapper}>
        <h1 style={styles.title}>
          Courses
        </h1>
        <div style={styles.listWrapper}>
          <GridList
            cellHeight={180}
            cols={4}
            style={styles.list}
          >
            {tilesData.map(x => (
              <Link
                to={`/courses/${x.title}`}
                key={x.title}
              >
                <GridTile
                  title={x.title}
                  subtitle={x.author}
                  style={styles.tile}
                />
              </Link>
            ))}
          </GridList>
        </div>
        <FloatingActionButton style={styles.fab}>
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}

const styles = {
  screenWrapper: {
    display: 'relative',
  },
  title: {
    fontSize: '32px',
  },
  listWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  list: {
    width: '100%',
  },
  tile: {
    backgroundColor: '#663399', // mui color
  },
  fab: {
    position: 'absolute',
    bottom: 0, // mui spacing
    left: 0, // mui spacing
  }
};

export default CourseListScreen;
