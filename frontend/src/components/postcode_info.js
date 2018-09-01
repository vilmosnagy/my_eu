import React from 'react'
import PropTypes from 'prop-types'

import ProjectStore from '../project_store'
import CordisInfo from './info_windows/cordis_info'
import CreativeInfo from './info_windows/creative_info'
import EsifInfo from './info_windows/esif_info'
import FtsInfo from './info_windows/fts_info'

const projectStore = new ProjectStore()

function makeProjectInfo(data) {
  if (data.dataset === 'esif') {
    return <EsifInfo key={data.myEuId} {...data} />
  } else if (data.dataset === 'cordis') {
    return <CordisInfo key={data.myEuId} {...data} />
  } else if (data.dataset === 'creative') {
    return <CreativeInfo key={data.myEuId} {...data} />
  } else if (data.dataset === 'fts') {
    return <FtsInfo key={data.myEuId} {...data} />
  } else {
    return <div>TODO</div>
  }
}

class PostcodeInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = { outwardCode: null }
  }

  render() {
    const projects = this.lookup()
    if (projects) {
      let header
      if (projects.length > 1) {
        header = (
          <h2>
            {projects.length} projects at {this.getPostcode()}
          </h2>
        )
      }

      return (
        <div id="my-eu-info">
          {header}
          {projects.map(makeProjectInfo)}
        </div>
      )
    } else {
      return <div>loading {this.getPostcode()}</div>
    }
  }

  lookup() {
    const { outwardCode, inwardCode } = this.props.match.params
    const projects = projectStore.lookup(outwardCode, inwardCode)
    if (projects) return projects
    projectStore.load(outwardCode).then(() => {
      this.setState({ outwardCode: outwardCode })
    })
    return null
  }

  getPostcode() {
    const { outwardCode, inwardCode } = this.props.match.params
    return `${outwardCode} ${inwardCode}`
  }
}

PostcodeInfo.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      outwardCode: PropTypes.string.isRequired,
      inwardCode: PropTypes.string.isRequired
    })
  })
}

export default PostcodeInfo