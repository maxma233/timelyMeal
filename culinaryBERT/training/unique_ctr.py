def is_unique(entities: list, entity: str) -> bool:
    try:
        entities.index(entity)
        return False
    except ValueError:
        return True
    
def get_tag(label: str) -> str:
    valid_tags = ['RESTAURANT', 'DISH']
    for tag in valid_tags:
        if label.find(tag) != -1:
            print(tag, label)
            return tag
        
def update_type_count(tag: str, dish_count: list, restaurant_count: list) -> None:
    match (tag):
        case ('RESTAURANT'):
            restaurant_count[0] += 1
        case ('DISH'):
            dish_count[0] += 1
        case (_):
            pass
            # print('How this happen?')

if __name__ == "__main__":
    # file = open(file='./train_original_PREV.txt', mode='r', encoding='utf-8')
    file = open(file='./restaurant_unique_stuff.txt', mode='r', encoding='utf-8')
    duplicates = 0
    duplicate_examples = []
    borked_examples = []

    # All the unique stuff in the file
    unique_examples = { 'dish': [], 'restaurant': [], 'negative': [] }
    collection_examples = { 'dish': [] , 'restaurant': [], 'negative': [] }
    curr_example = { 'example': '', 'type': ''}

    upper_example = ''
    lower_example = ''

    positive_examples = 0
    dish_examples = [0]
    restaurant_examples = [0]
    negative_examples = 0
    borked = 0
    is_positive = False
    examples_list_ptr = ''
    skip = False
    tag = ''

    line_num = 0
    lines = file.readlines()

    for line in lines:

        # print(f'About to read line num: {line_num}')

        line_num += 1

        curr_line = line

        if (curr_line != '\n'):
            try:


                if (skip):
                    # Skip the whole example once something is borked
                    # print('skipping example!')
                    continue

                # Lowercase the example on the current line
                add_this: list[str] = curr_line.split()

                if (len(add_this) != 2):
                    raise ValueError()
                
                label = add_this[1]
                    
                if label.startswith(('B-', 'I-')):
                    add_this[0] = str.upper(add_this[0][:1]) + add_this[0][1:]
                    tag = get_tag(add_this[1])
                    is_positive = True

                    tag_name = str.lower(tag)

                    if (len(examples_list_ptr) != 0 and examples_list_ptr != tag_name):
                        raise Exception
                    
                    examples_list_ptr = tag_name
                
                elif label.startswith('O'):
                    add_this[0] = str(add_this[0])
                else:
                    raise Exception

                # if add_this[1].find(())

                new_line = " ".join(add_this)

                new_line.strip()
                
                # print("Current new line: ", new_line)

                # Producing safe output
                bytes_line = new_line.encode(encoding='ascii', errors='strict')
                safe_line = bytes_line.decode(encoding='utf-8', errors='strict')

                # print("safe line: ", safe_line)

                # Store the message in the example section and the label in the type
                curr_example['example'] += safe_line + '\n'
                curr_example['type'] = examples_list_ptr

                # print("Current Example:",curr_example)

                upper_example += str.upper(safe_line[:1]) + safe_line[1:] + '\n'
                lower_example += str.lower(str.split(safe_line,' ')[0]) + ' ' + str.split(safe_line,' ')[1] + '\n'
                # print('upper_example', upper_example)
                # print('lower_example', lower_example)
            except UnicodeEncodeError as e:
                # print('borked data found, skipping!')
                borked_examples.append(new_line)
                skip = True
            except ValueError as e:
                print(f'Yo this is cooked (Line num: {line_num}): ', add_this)
                skip = True
            except Exception as e:
                skip = True
            finally:
                continue

        try:
            
            # Skip the borked example
            if (skip):
                borked += 1
                raise Exception

            # Can only be negative if examples_list_ptr has not encountered a dish or restaurant label
            if (not is_positive):
                examples_list_ptr = 'negative'

            if is_unique(unique_examples[examples_list_ptr], curr_example):
                if (is_positive):
                    positive_examples += 1
                else:
                    collection_examples['dish'].append(upper_example)
                    collection_examples['dish'].append(lower_example)
                    collection_examples['restaurant'].append(upper_example)
                    collection_examples['restaurant'].append(lower_example)
                    negative_examples += 1

                unique_examples[examples_list_ptr].append(curr_example)
                update_type_count(tag, dish_count=dish_examples, restaurant_count=restaurant_examples)

                collection_examples[examples_list_ptr].append(upper_example)
                collection_examples[examples_list_ptr].append(lower_example)


                # print('added: ', lower_example)

            else:
                raise ValueError
            
        except ValueError:
            # print('It is a duplicate')
            duplicates+=1
            duplicate_examples.append(curr_example)

        except Exception:
            # print('skipping')
            pass

        finally:
            # Reset the example
            curr_example = { 'example': '', 'type': ''}
            upper_example = ''
            lower_example = ''
            is_positive = False
            examples_list_ptr = ''
            skip = False
            tag = ''

    # print('Unique set: ', unique_examples)

    print('Number of unique elements: ', len(unique_examples['negative']) + len(unique_examples['restaurant']) + len(unique_examples['dish']))
    print(f'Duplicates : {duplicates}')    
    print('Positive unique examples: ', positive_examples)
    # print(unique_examples['dish'], unique_examples['restaurant'])
    # print('Positive list: ', unique_examples['positive'])
    print('Negative unique examples: ', negative_examples)
    # print('Negative list: ', unique_examples['negative'])
    # print('Borked: ', borked_examples)
    # print('Borked Stuff:', borked_examples)
    print('Dish examples: ', dish_examples)
    print('Restaurant examples: ', restaurant_examples)

    exit()

    try:
        with open('./dish_unique_stuff.txt', 'w') as dish_file:
            # Print the positive stuff first then the negative stuff
            for i in range(len(collection_examples['dish'])):
                example: str = collection_examples['dish'][i]
                sentence_parts = example.split(sep='\n')

                # for part in sentence_parts:
                #     string_parts = part.split(sep=' ')
                #     string_parts = [word for word in string_parts[1:] if word[:1] == 'I' and len(word) == 1]

                #     list(map(lambda x: unique_file.write(f'{x}\n'), string_parts))
                # unique_file.write('\n')

                # print(string_parts)
                list(map(lambda x: dish_file.write(f'{x}\n'), sentence_parts))

        with open('./restaurant_unique_stuff.txt', 'w') as restaurant_file:

            for i in range(len(collection_examples['restaurant'])):
                example: str = collection_examples['restaurant'][i]
                sentence_parts = example.split(sep='\n')

                # for part in sentence_parts:
                #     string_parts = part.split(sep=' ')
                #     string_parts = [word for word in string_parts[1:] if word[:1] == 'I' and len(word) == 1]

                #     list(map(lambda x: unique_file.write(f'{x}\n'), string_parts))
                # unique_file.write('\n')
                
                list(map(lambda x: restaurant_file.write(f'{x}\n'), sentence_parts))

        with open('./negative_unique_stuff.txt', 'w') as negative_file:
            for i in range(len(collection_examples['negative'])):
                example: str = collection_examples['negative'][i]
                sentence_parts = example.split(sep='\n')
            
                list(map(lambda x: negative_file.write(f'{x}\n'), sentence_parts))

    except OSError:
        print('Something went wrong with opening the unique_stuff folder!')
        exit()

    print('New file created!')