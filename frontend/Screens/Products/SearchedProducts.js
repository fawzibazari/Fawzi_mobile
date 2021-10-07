import React from 'react';
import { View, StyleSheet, Dimensions} from 'react-native'
import { Content, Left, Body, ListItem, Thumbnail, Text, Item } from 'native-base';

const SearchedProduct = (props) => {
    const { productsFiltered } = props;
    return (
    <Content>
        {productsFiltered.length > 0 ? (
            productsFiltered.map((item) => (
                <ListItem
                //onPress = (navigation)
                key={item._id.$oid}
                avatar
           >
           <Left>
               <Thumbnail
               source={{uri: item.image ? 
                item.image : 'https://cdn.pixabay.com/photo/2012/04/01/17/29/box-23649_960_720.png'}}
               
               />  
           </Left>
           <Body>
               <Text>{item.name}</Text>
               <Text note>{item.description}</Text>
           </Body>
            </ListItem>  
            ))
        ):(
            <View style={StyleSheet.center}>
                <Text style={{alignSelf: "center"}}>
                    y'a pas de produits
                </Text>
            </View>
        )}
    </Content>
    ) 
}

const styles = StyleSheet.create({
    center: {
        justifyContent: "center",
        alignItems: "center"
    }
})
export default SearchedProduct