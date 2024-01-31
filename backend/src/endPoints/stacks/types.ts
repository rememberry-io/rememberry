export type ParentAndChildId = {
  child_id: string;
  new_parent_id: string;
};

export type Stack = {
  id: string;
  stack_name: string | null;
  number_of_learned_cards: number | null;
  number_of_unlearned_cards: number | null;
  created_at: Date;
  updated_at: Date;
  mapId: string | null;
  stack_description: string | null;
  positioning: string | null;
  parent_stack_id: string | null;
  children?: Stack[];
};
