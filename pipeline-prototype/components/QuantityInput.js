import React, { useState, } from 'react';
import { View, StyleSheet, Text, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

function QuantityInput({ quantity, setQuantity, onButtonDeletion }) {

    const increment = () => {
        if (quantity < 10) {
            setQuantity(quantity + 1);

        }
    };

    const decrement = () => {
        if (quantity > 0) {
            setQuantity(quantity - 1);
        }
    }

    return (
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', alignSelf: 'center' }}>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderColor: '#ccc', borderWidth: 2, backgroundColor: '#eee', borderRadius: 6 }}>
                <Pressable
                    onPress={quantity < 1 ? onButtonDeletion : decrement}
                    style={{ padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5 }}
                >
                    <Icon name={quantity < 1 ? 'trash' : 'remove'} type="material" size={16} color="#333" />
                </Pressable>
                <Text style={{ paddingRight: 10, paddingLeft: 10, backgroundColor: '#eee' }}>{quantity}</Text>
                <Pressable
                    onPress={increment}
                    style={{ padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5 }}
                >
                    <Icon name="add" type="material" size={16} color="#333" />

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