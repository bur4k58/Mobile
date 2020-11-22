export const MapApi = () =>  {
    state = {
        apiList: [],
        loading: true
    }
  
    const componentDidMount = async () =>{
        try {
            const mapApi = await fetch('https://api.jsonbin.io/b/5fba809904be4f05c928dbfb');
            const map = await mapApi.json();
            this.setState({apiList: map.features, loading: false});
        } catch(err) {
            console.log("Error fetching data-----------", err);
        }
    }
  
    renderItem(data) = () =>{
        return <TouchableOpacity style={{backgroundColor: 'transparent'}}>
                    <View >
                        <Text >{data.item.naam}</Text>
                    </View>
                </TouchableOpacity>
    }
    render() {
        //Destruct pokeList and Loading from state.
        const { mapList, loading } = this.state;
        if(!loading) {
            return <FlatList 
                    data={mapList}
                    renderItem={this.renderItem}
                    keyExtractor={(item) => item.naam} 
                    />
        } else {
            return <ActivityIndicator />
        }
    }
  }