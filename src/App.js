import React,{Component } from 'react';
import './App.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter,Navbar,NavbarBrand,Table} from 'reactstrap';
import $ from 'jquery';
var level=1,i;
var configuration = {
	branding: {"name" : "SkillPill" },
	title: "Values",
	category: "Baselines",
	icon: "./skillpill.png",
	url: "https://ix61k6qun9.execute-api.ap-southeast-1.amazonaws.com/prod/lifetoolsdataset",
	levelDetails: [{count:8 ,rule: "minimum" }, 
                  {count:7, rule: "exact"},
                  {count:6, rule: "exact"},
                  {count:5, rule: "exact"},
                  {count:4, rule: "exact"},
                  {count:3, rule: "exact"},
                  {count:2, rule: "exact"},
                  {count:1, rule: "exact"}]
}

$("#favlogo").attr('href',configuration.icon);
function DataButton(props) {
  return (
    <Button className="itemButton" id={props.idButton} onClick={props.onClick}>{props.value}</Button>
  );
}
class DataSet extends Component {
  renderButton(i){
    let item=this.props.item;
    let idButton="qual_"+i;
    return (
      <DataButton
          key={idButton}
          idButton={idButton}
          value={item[i].Property}
          onClick={() => this.props.onClick(i)}
        />
    )
  }
  render() {
    const rows=[];    
    for (i=0;i<this.props.item.length;i++)
      {
        if(level<=configuration.levelDetails.length){
          if(this.props.item[i].Level===String(level)){
            rows.push(
            this.renderButton(i)
            );
          }
        }
      }
      return (<div className="itemGroup">{rows}</div>)
  }
}

class OrderSet extends Component {
  render() {
    var i,j,k=1;
    const rows=[];
    for(i=(configuration.levelDetails.length+1);i>(configuration.levelDetails.length-5);i--){
    for(j=0;j<this.props.item.length;j++)
      if(this.props.item[j].Level===String(i)){
        rows.push(
          <tr>
            <th scope="row">{k}</th>
            <td>{this.props.item[j].Property}</td>
            <td>{this.props.item[j].Meaning}</td>
          </tr>
        )
        k++;
      }
    }
    if(level===(configuration.levelDetails.length+1))
    return (
    <Table striped>
      <thead>
        <tr>
          <th>#</th>
          <th>Belief</th>
          <th>Counter-Belief</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
    );
    else return null;
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: true,
      item:[],
      selected:0    
    };
    this.toggle = this.toggle.bind(this);
    this.submit = this.submit.bind(this);
    this.updateStatusLevel = this.updateStatusLevel.bind(this);
    this.levelCheck = this.levelCheck.bind(this);
  }


  componentDidMount() {
    const apiUrl = this.props.initial.apiUrl;
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => this.setState({item:data}));
  }
  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }
  updateSelection(i) {
    let property = document.getElementById('qual_'+i);
    if(configuration.levelDetails[level-1].rule==="exact" && this.state.item[i].Status==='0' && configuration.levelDetails[level-1].count===this.state.selected)
    return;
    else if(this.state.item[i].Status==='0')
    {
      property.style.backgroundColor="#00cc00";
      let testItem = Object.assign({}, this.state);
      testItem.item[i].Status = "1";
      this.setState(testItem);
      this.setState({
        selected:(this.state.selected+1)
      })
        //$("#currentCount").text(selected+levelCount());
    }
    else if(this.state.item[i].Status==='1')
    {
      property.style.backgroundColor="#0000FF";
      let testItem = Object.assign({}, this.state);
      testItem.item[i].Status = "0";
      this.setState(testItem);
      this.setState({
        selected:(this.state.selected-1)
      })
        //$("#currentCount").text(selected+levelCount());
    }
  }
  levelCheck(){
    if(configuration.levelDetails[level-1].rule==="minimum" && configuration.levelDetails[level-1].count<=this.state.selected)
    {
         return "true";
    }
     else if(configuration.levelDetails[level-1].rule==="exact" && configuration.levelDetails[level-1].count===this.state.selected)
    {
        return "true";
    }
    else
    return "false";
  }
  submit(){
    if (this.levelCheck()==="true")
    {
      this.setState({
        selected:0
      })
      //this.updateStatusLevel();
    }
  }
  updateStatusLevel()
  {
    console.log("test");
    this.setState({
      selected:0
    })
    level++;
    for(i=0;i<this.state.item.length;i++)
    {
      if(this.state.item[i].Status==='1')
      {
        let testItem = Object.assign({}, this.state);
        testItem.item[i].Level=String(parseInt(testItem.item[i].Level)+1);
        testItem.item[i].Status='0';
        document.getElementById('qual_'+i).style.backgroundColor="#0000FF";
        this.setState(testItem);
      }
    }
  }

  
  render() {
    return (<div>
    <div className="Header" >
            <Navbar fixed="top" dark color ="dark" >
              <div className="container">
                <NavbarBrand ><img src={this.props.initial.icon} height="70" width="70" />Select your {this.props.initial.title}</NavbarBrand>
              </div>
            </Navbar>
        </div>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}><img src={this.props.initial.icon} height="70" width="70" />{this.props.initial.name}</ModalHeader>
          <ModalBody>test</ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={this.toggle}>Do Something</Button>{' '}
            <Button color='secondary' onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
        <DataSet item={this.state.item} onClick={i => this.updateSelection(i)}/>
        <OrderSet item={this.state.item}/>
        <div className="Footer">
            <Navbar fixed="bottom" dark color="dark" text="light">
                <Button onClick={this.submit} variant="dark" size="lg" block>Submit {this.state.selected}</Button>
            </Navbar>
        </div>
    </div>
    )}
}

export default App;
