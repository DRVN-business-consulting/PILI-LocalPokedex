import { Stack } from 'expo-router'
import { colors, themeColors } from './themes/colors'
import { ThemeContextProvider } from './providers/theme_provider'
import { FavouriteContextProvider } from './providers/fav_provider'
import { PokemonProvider } from '../context/pokemonContext'

const AppLayout = () => {
  return (
    <ThemeContextProvider>
        <PokemonProvider>
        <FavouriteContextProvider>
            <Stack>
                <Stack.Screen
                    name='index'
                    options={
                        {
                            headerShown: false
                        }
                    }
                />
                <Stack.Screen
                    name='pokedex/(tabs)'  
                    options={
                        {
                            headerShown: false,
                        }
                    } 
                />
                <Stack.Screen
                    name='pokedex/[id]'
                    options={
                        {
                            title: 'View Pokemon',
                           headerShown: false,
                        }
                    } 
                />
            </Stack>
        </FavouriteContextProvider>
        </PokemonProvider>
    </ThemeContextProvider>
  )
}

export default AppLayout