import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import api from './Api'

const statuses = {
    'watched': 'Assistido',
    'watching': 'Assistindo',
    'toWatch': 'Assistir'
}

class EditSeries extends Component{
    constructor(props){
        super(props)
        this.state = {
            genres: [],
            isLoading: false,
            Redirect: false,
            series:{}
        }

        this.saveSeries = this.saveSeries.bind(this)
    }
    componentDidMount(){
    this.setState({ isLoading: true })
    api.loadSeriesById(this.props.match.params.id)
    .then((res) => { 
        this.setState({series: res.data})
        this.refs.name.value = this.state.series.name
        this.refs.genre.value = this.state.series.genre
        this.refs.status.value = this.state.series.status
        this.refs.comments.value = this.state.series.comments
    })
    api.loadGenres()
        .then((res)=>{
            this.setState({
            isLoading: false,
            genres: res.data
          })
        })
      }
    saveSeries(){
        const newSeries = {
            id: this.props.match.params.id,
            name: this.refs.name.value,
            status: this.refs.status.value,
            genre: this.refs.genre.value,
            comments: this.refs.comments.value
        }
        api.updateSeries(newSeries)
        .then((res) => 
            {
                this.setState({
                redirect: '/series/'+this.refs.genre.value
            })
        })
    }
    
    render(){
        return(
            <section className="intro-section">
            {
                <Redirect to={this.state.redirect}/>
            }
                <h1>Editar série</h1>
                <form>
                    Nome: <input type="text" ref='name' className="form-control"/><br />
                    Status: <select ref='status'>
                        { Object
                            .keys(statuses)
                            .map( key => 
                            <option key={key} value={key}>
                                {statuses[key]} 
                            </option>) 
                        }
                        </select><br />
                    Gênero: <select ref='genre'>
                        { this.state.genres
                            .map( key => 
                            <option key={key} value={key}>
                                {key} 
                            </option>) 
                        }
                        </select><br />
                    Comentários: <textarea defaultValue={this.state.series.comments}ref='comments'className="form-control"/><br />
                    <button type="button" onClick={this.saveSeries}>Salvar</button>
                </form>
            </section>
        )
    }
}

export default EditSeries