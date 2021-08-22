import React, { useState, useEffect} from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList
} from "react-native";

const data = require('../../assets/data/product.json');
import ProductList from "./ProductList";



const ProductContainer = () => {

    const [products, setProducts] = useState([]);

    useEffect (() => {
        setProducts(data);

        return () => {
            setProducts([])
        }
    }, [])
return (
    <View>
        <Text>Container des produits</Text>
        <View style={{ marginTop: 100}}>
        <FlatList
        horizontal 
        data={products}
        renderItem={({item}) => <ProductList
         key={item.id}
         item={item}/>}
        keyExtractor={item => item.name}
        />
        </View>
    </View>
)
}

export default ProductContainer;