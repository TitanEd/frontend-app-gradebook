from tutor import hooks
from tutormfe.hooks import PLUGIN_SLOTS


hooks.Filters.ENV_PATCHES.add_item(
     (
         "mfe-env-config-runtime-definitions-gradebook",
         """
        // This file contains configuration for plugins and environment variables.
const { PLUGIN_OPERATIONS, DIRECT_PLUGIN } = await import('@openedx/frontend-plugin-framework');
const { default: CustomGradebookHeader } = await import('./src/components/GradebookHeader/CustomGradebookHeader');

{% raw %}

const getPluginSlots = () => {
    if (typeof window !== 'undefined' && localStorage.getItem('oldUI') === 'true') {
      return {};
    }
  
    return {
    gradebook_header_plugin_slot: {
        plugins: [
          {
            op: PLUGIN_OPERATIONS.Insert,
            widget: {
              id: 'gradebook_header_plugin_slot',
              type: DIRECT_PLUGIN,
              priority: 1,
              RenderWidget: (props) => <CustomGradebookHeader {...props} />,
            },
          },
        ],
      },
} };

// Load environment variables from .env file
config.pluginSlots = getPluginSlots();

{% endraw %}
"""

     ))