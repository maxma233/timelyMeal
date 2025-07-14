import React, { useState, } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

function QuantityInput({ quantity, setQuantity }) {

    const increment = () => {
        if (quantity < 10) {
            setQuantity(quantity + 1);

        }
    };

    const decrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    }

    return (
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 2, borderColor: '#ccc', borderWidth: '2px', backgroundColor: '#eee', borderRadius: '5px' }}>
                <Pressable
                    onPress={increment}
                    style={{ padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5 }}
                >
                    <Icon name="add" type="material" size={10} color="#333" />

                </Pressable>
                <Text style={{ paddingRight: 10, paddingLeft: 10, backgroundColor: '#eee' }}>{quantity}</Text>
                <Pressable
                    onPress={decrement}
                    style={{ padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5 }}
                >
                    <Icon name="remove" type="material" size={10} color="#333" />
                </Pressable>
            </View>


        </View >

    );

}

export default QuantityInput;

const styles = StyleSheet.create({
    input: {

    },
})