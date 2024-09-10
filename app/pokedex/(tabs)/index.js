import { View, SectionList, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Pokemon from '../components/pokemon'
import { API_URL } from '../../constants'
import { useTheme } from '../../providers/theme_provider'
import { colors, themeColors, typeColors } from '../../themes/colors'
import { myTheme } from '../../themes/myTheme'
import { SafeAreaView } from 'react-native-safe-area-context'
import TypeHeader from '../components/type_header'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePokemons } from '../../../context/pokemonContext'


const IndexScreen = () => {
    
    const { theme } = useTheme();
    const { allPokemons, updatePokemonList } = usePokemons();
    const [loading, setLoading] = useState(false)
    
    const getPokemon = async() => {
        
        await updatePokemonList();
        setLoading(false);
    }

    useEffect(() => {
        setLoading(true);
        getPokemon();
    }, [])

    const themeColor = themeColors[theme];

    if(loading) {
        return (
        <View style={[myTheme.centerInContainer, { backgroundColor: themeColor.container}]}>
            <ActivityIndicator color={colors.green}/>
       </View>
       )
    } 

    return (
        <SafeAreaView>
            <SectionList 
                style={{ backgroundColor: themeColor.container}}
                sections={allPokemons}  
                renderSectionHeader={({ section: {type}}) => <TypeHeader type={type}/>} 
                renderItem={({ item }) => <Pokemon  pokemon={item} />}  
            />
        </SafeAreaView>
    )
}

export default IndexScreen