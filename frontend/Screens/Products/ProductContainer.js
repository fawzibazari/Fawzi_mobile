import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList, StyleSheet, Text, View
} from "react-native";
import ProductList from "./ProductList";
import SearchedProduct from "./SearchedProducts";

import {Container, Header, Icon, Item, Input,} from 'native-base';

const data = require('../../assets/data/product.json');

const ProductContainer = () => {

    const [products, setProducts] = useState([]);
    const [productsFiltered, setProductsFiltered] = useState([]);
    const [focus, setFocus] = useState();


    useEffect (() => {
        setProducts(data);
        setProductsFiltered(data);
        setFocus(false);

        return () => {
            setProducts([]);
            setProductsFiltered([]);
            setFocus();
        }
    }, [])

    const searchProduct = (text) => {
        setProductsFiltered(
          products.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
        );
      };
    
      const openList = () => {
        setFocus(true);
      };
    
      const onBlur = () => {
        setFocus(false);
      };
return (
    <Container>
        <Header searchBar rounded> 
        <Item>
     <Icon name="ios-search" />
     <Input
       placeholder="rechercher"
       onFocus={openList}
       onChangeText={(text) => searchProduct(text)}
     />
     {focus == true ? <Icon onPress={onBlur} name="ios-close" /> : null}
     {/* pas encore fini le back-end du coup je enleve mon focus */}
   </Item>
        </Header>

        {focus == true ? (
            <SearchedProduct
            productsFiltered={productsFiltered} />

        ): (
            <View>
            <Text>Container des produits</Text>
            <View style={{ backgroundColor: 'gainsboro' }}>
            <FlatList
            numColumns={2}
            data={products}
            renderItem={({item}) => <ProductList
             key={item.id}
             item={item}/>}
            keyExtractor={item => item.name}
            />
            </View>
        </View>
        
        )}
 </Container>
)
}

export default ProductContainer;