import nose.tools as nt

from sudo.models import todos

# class TestSortModels(object):
#     def test_sorts_the_models_correctly(self):
#         ts = [{
#             "id": 1,
#             "previous_id": 3,
#             "next_id": 2
#         }, {
#             "id": 2,
#             "previous_id": 1,
#             "next_id": None
#         }, {
#             "id": 3,
#             "previous_id": None,
#             "next_id": 1
#         }]

#         ts = todos.sort_todos(ts)
#         ts = [t['id'] for t in ts]
#         nt.assert_equals(ts, [3, 1, 2])
